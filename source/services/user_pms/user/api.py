# -*- coding: utf-8 -*-
"""
    >File    : views.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/10/13 07:10
"""
import ormar
from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from models import User
from user.serializers import UserList, UserCreated, UserEdited
from user.serializers import AccountInfo
from basic.initdb import DB
from basic.common.paginate import *
from basic.common.query_filter_params import QueryParameters
from user.services import set_role_of_user
from auth.services import verify_password
from role.services import merge_pms

router_user = APIRouter()


@router_user.post(
    '',
    description='创建用户',
    response_model=UserList,
)
async def create_user(
    request: Request,
    user: UserCreated
):
    init_data = user.dict()
    # 'confirm_password' in init_data and init_data.pop('confirm_password')
    # 用户英文名根据邮箱生成,创建后不能修改邮箱故不变,首字母为数字时添加前缀字符
    en_name = ''.join(filter(str.isalnum, user.email.split('@')[0]))
    en_name = 'u' + en_name if en_name[0].isdigit() else en_name
    init_data['en_name'] = en_name

    role_ids = init_data.pop('role', [])
    if not role_ids:
        new_user = await User.objects.create(**init_data)
    else:
        async with DB.transaction():
            init_data['created_by'] = request.user.id
            init_data['updated_by'] = request.user.id
            new_user = await User.objects.create(**init_data)
            await set_role_of_user(new_user, role_ids, is_clear=False)
    return new_user


@router_user.get(
    '',
    description='用户列表',
    response_model=Page[UserList],
    response_model_exclude_unset=True
)
async def list_user(
        query_params: QueryParameters = Depends(QueryParameters)
):
    """
    :param query_params:
    :return:
    """
    query_filter = query_params.filter_
    if isinstance(query_filter, dict):
        query_filter = ormar.queryset.clause.FilterGroup(**query_filter)
    result = await paginate(User.objects.select_related(
        ['role']
    ).filter(
        query_filter
    ), params=query_params.params)
    json_result = result.dict()
    return json_result


@router_user.put(
    '/{user_id}',
    description='更新用户信息',
    response_description='返回空',
)
async def update_user(
    request: Request,
    user: UserEdited,
    user_id: int = Path(..., ge=1, description='需要更新的用户ID'),
):
    update_data = user.dict(exclude_unset=True)
    _user = await User.objects.get_or_none(id=user_id)
    if not _user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'用户{user_id}无效')

    if 'role' in update_data:
        role_ids = update_data.pop('role', [])
        await set_role_of_user(_user, role_ids=role_ids, is_clear=True)

    # 修改密码
    # 旧密码有一个输入，做密码更新校验
    if user.old_password or user.password:
        if not verify_password(user.old_password, _user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail='原始密码错误'
            )
        if user.password is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail='需要输入新密码'
            )
        update_data['password'] = user.password
        del update_data['old_password']

    if update_data:
        update_data['updated_by'] = request.user.id
        _user = await _user.update(**update_data)

    return JSONResponse(dict(id=user_id))


@router_user.delete(
    '/{user_id}',
    description='删除用户',
    status_code=status.HTTP_200_OK,
)
async def delete_user(
        user_id: int = Path(..., ge=1, description='用户ID')
):
    user = await User.objects.get(id=user_id)
    if user:
        async with DB.transaction():
            await user.role.clear()
            await user.delete()
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'用户{user_id}无效')


@router_user.get(
    '/account',
    response_model=None,
    response_description='获取用户角色和权限, 带user_id获取指定用户，否则获取当前登录用户。'
)
async def account(
    request: Request,
    user_id: int = Query(None, description='用户ID')
):
    if user_id:
        user = await User.objects.select_related('role').filter(id=user_id).first()
    else:
        user = request.user

    pms_ids = set()
    pms = list()
    for role in user.role:
        for _pms in await role.permissions.all():
            if _pms.id in pms_ids:
                continue
            pms_ids.add(_pms.id)
            pms.append(_pms)

    pms_result = merge_pms(list(pms))
    result = AccountInfo.from_orm(user).dict()
    result['permissions'] = pms_result
    return JSONResponse(result)


@router_user.get(
    '/activate',
    response_model=None,
)
async def check_user_token_and_permissions_return_user(
        request: Request,
):
    return AccountInfo.from_orm(request.user).dict()
