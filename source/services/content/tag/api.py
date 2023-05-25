# -*- coding: utf-8 -*-
"""
    >File    : api.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/22 17:21
"""
from typing import List
from fastapi import APIRouter, Depends, Request, Path, HTTPException, status
from fastapi.responses import JSONResponse
from models import TagManager, Model
from tag.serializers import TagSerializers, TagCreated, TagEdited, TagAllSerializers
from basic.common.paginate import Page
from basic.common.paginate import paginate
from basic.common.query_filter_params import QueryParameters


router_tag = APIRouter()


@router_tag.post(
    "",
    response_model=TagSerializers,
    description='创建标签',
)
async def add_tag(request: Request, tag: TagCreated):
    data = tag.dict()
    data['created_by'] = request.user.id
    data['updated_by'] = request.user.id
    return await TagManager.objects.create(**data)


@router_tag.get(
    '',
    description='标签列表',
    response_model=Page[TagSerializers]
)
async def list_tag(
    params: QueryParameters = Depends(QueryParameters)
):
    return await paginate(TagManager.objects.filter(), params=params.params)


@router_tag.get(
    '/all',
    description='角色列表',
    response_description='所有角色',
    response_model=List[TagAllSerializers]
)
async def list_all_tag():
    return await TagManager.objects.filter().all()


@router_tag.put(
    '/{tag_id}',
    description='更新标签',
    response_description='返回空',
)
async def update_tag(
        tag: TagEdited,
        tag_id: int = Path(..., ge=1, description='需要更新的ID'),
):
    update_data = tag.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='更新数据不能为空')
    _tag = await TagManager.objects.get_or_none(pk=tag_id)
    if not (_tag and await _tag.update(**update_data)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='标签不存在')
    return JSONResponse(dict(id=tag_id))


@router_tag.delete(
    '/{tag_id}',
    description='删除权限',
    response_description='Y/N'
)
async def delete_tag(
        tag_id: int = Path(..., ge=1, description='tag id'),
):
    """
    :param request:
    :param tag_id:
    :return:
    """
    _count = await Model.objects.filter(tag__id=tag_id).count()
    if _count > 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='标签关联模型资源不能删除')
    else:
        await TagManager.objects.filter(id=tag_id).delete()
        return dict(message='删除成功')
