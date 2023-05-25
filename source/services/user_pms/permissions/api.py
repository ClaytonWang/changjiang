# -*- coding: utf-8 -*-
"""
    >File    : permissions_api.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/24 09:04
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi import Path, status, Query
from fastapi.responses import JSONResponse
from basic.common.paginate import Page
from basic.common.paginate import paginate
from basic.common.query_filter_params import QueryParameters
from models import Permissions
from role.services import merge_pms
from permissions.services import get_permissions
from permissions.serializers import PmsCreatedSerializer, PmsListSerializers, PmsEditSerializer

router_pms = APIRouter()

"""
权限CRUD
"""


@router_pms.get(
    '',
    description='权限列表',
    response_description='权限列表',
    response_model=Page[PmsListSerializers]
)
async def list_role(
        params: QueryParameters = Depends(QueryParameters)
):
    return await paginate(Permissions.objects.filter(), params=params.params)


@router_pms.post(
    "",
    response_model=PmsCreatedSerializer,
    description='新建菜单',
    response_description="创建信息"
)
async def add_pms(pms: Permissions):
    # TODO 添加创建用户
    return await pms.save()


@router_pms.put(
    '/pms_id}',
    description='更新权限',
    response_description='返回空',
)
async def update_pms(
        pms: PmsEditSerializer,
        pms_id: int = Path(..., ge=1, description='需要更新的菜单ID'),
):
    # TODO 添加更新用户
    update_data = pms.dict(exclude_unset=True)

    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='更新数据不能为空')
    _pms = await Permissions.objects.get_or_none(pk=pms_id)
    if not (_pms and await _pms.update(**update_data)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='菜单不存在')
    return JSONResponse(dict(id=pms_id))


@router_pms.get(
    '/tree',
    description='所有菜单',
    response_description='所有角色',
)
async def list_tree_pms(
        pms_id: int = Query(None, ge=1, description='角色ID'),
):
    if pms_id:
        _pms = await Permissions.objects.filter(id=pms_id).first()
        return await get_permissions(_pms)
    else:
        pms = await Permissions.objects.all()
    return merge_pms(pms)


@router_pms.delete(
    '/{pms_id}',
    description='删除菜单',
    response_description='Y/N'
)
async def delete_pms(
        pms_id: int = Path(..., ge=1, description='菜单ID'),
):
    """
    ID不存在, 成功删除掉记录数
    :param pms_id:
    :return:
    """
    role_count = await Permissions.objects.select_related('role').filter(id=pms_id).count()

    if role_count > 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='菜单关联权限资源不能删除')
    else:
        await Permissions.objects.filter(id=pms_id).delete()
        return dict(message='删除成功')
