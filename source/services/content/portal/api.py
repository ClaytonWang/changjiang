# -*- coding: utf-8 -*-
"""
    >File    : api.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/22 17:20
"""
from typing import List, Optional
from fastapi import APIRouter, Request, Path, Depends, Form, HTTPException, status
from fastapi.responses import JSONResponse
from basic.common.paginate import *
from basic.common.query_filter_params import QueryParameters
from portal.serializers import BannerCreated, FeatureCreated, BeautifulCreated
from portal.serializers import BannerEdited, FeatureEdited, BeautifulEdited, PortalList
from portal.services import update_portal_instance, portal_update
from models import Portal, PortalDeploy, Category
from basic.initdb import DB

router_portal = APIRouter()


@router_portal.post(
    '/banner',
    description='创建/更新',
    response_model=List[PortalList]
)
async def created_banner(
        request: Request,
        banner: List[BannerCreated]
):
    objects = await update_portal_instance(banner, request, 'banner')
    return objects


@router_portal.post(
    '/feature',
    description='创建/更新',
    response_model=List[PortalList]
)
async def created_feature(
        request: Request,
        feature: List[FeatureCreated]
):
    objects = await update_portal_instance(feature, request, 'feature')
    return objects


@router_portal.post(
    '/btf',
    description='创建/更新',
    response_model=List[PortalList]
)
async def created_btf(
        request: Request,
        beautiful: List[BeautifulCreated],
):
    objects = await update_portal_instance(beautiful, request, 'beautiful')
    return objects


@router_portal.get(
    '',
    description='banner列表',
    response_model=Page[PortalList],
    response_model_exclude_unset=True
)
async def list_portal(
        query_params: QueryParameters = Depends(QueryParameters)
):
    """
    :param query_params:
    :return:
    """
    query_filter = query_params.filter_
    result = await paginate(Portal.objects.filter(**query_filter).order_by(['category', 'index']), params=query_params.params)
    json_result = result.dict()
    return json_result


@router_portal.post(
    '/deploy',
    description='发布',
)
async def deploy(
        request: Request,
        category: Optional[str] = Form(None)
):
    if category:
        categories = [category]
    else:
        categories = [item.value for item in list(Category)]

    fields = ['title', 'sub_title', 'img', 'link', 'color', 'category', 'index']
    portal = await Portal.objects.filter(category__in=categories).all()
    async with DB.transaction():
        # delete
        await PortalDeploy.objects.delete(category__in=categories)
        objects = []
        for item in portal:
            data = {field: getattr(item, field) for field in fields}
            data['state'] = 'success'
            data['created_by'] = request.user.id
            data['updated_by'] = request.user.id
            objects.append(PortalDeploy(**data))
        await PortalDeploy.objects.bulk_create(objects)
        await Portal.objects.filter(category__in=categories).update(state='success')
    return JSONResponse({})

"""
更新，暂时没使用
"""


@router_portal.put(
    '/feature/{portal_id}'
)
async def banner_update(
        feature: FeatureEdited,
        portal_id: int = Path(..., ge=1, description='id')
):
    await portal_update(feature, portal_id)
    return JSONResponse(dict(id=portal_id))


@router_portal.put(
    '/banner/{portal_id}'
)
async def banner_update(
        banner: BannerEdited,
        portal_id: int = Path(..., ge=1, description='id')
):
    await portal_update(banner, portal_id)
    return JSONResponse(dict(id=portal_id))


@router_portal.put(
    '/btf/{portal_id}'
)
async def banner_update(
        btf: BeautifulEdited,
        portal_id: int = Path(..., ge=1, description='id')
):
    await portal_update(btf, portal_id)
    return JSONResponse(dict(id=portal_id))
