# -*- coding: utf-8 -*-
"""
    >File    : role_api.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/24 09:04
"""
import copy
from typing import List
from fastapi import APIRouter, Depends, Request, Path, HTTPException, status
from fastapi.responses import JSONResponse
from models.user import Role, User
from models.permissions import Permissions
from role.serializers import RoleSerializers, RoleCreated, RoleEdited
from role.serializers import SetRolePms
from basic.initdb import DB
from basic.common.paginate import Page
from basic.common.paginate import Params
from basic.common.paginate import paginate
from basic.common.query_filter_params import QueryParameters
from role.services import SuperManWrapper
from role.services import merge_pms
from config import SUPER_ROLE
from pypinyin import lazy_pinyin


router_role = APIRouter()


@router_role.post(
    "",
    response_model=RoleSerializers,
    description='新建角色',
    response_description="创建角色信息"
)
async def add_role(role: RoleCreated):
    en_name = ''.join(lazy_pinyin(role.value))
    return await Role.objects.create(**dict(name=en_name, value=role.value))


@router_role.get(
    '',
    description='角色列表',
    response_description='角色列表',
    response_model=Page[RoleSerializers]
)
async def list_role(
    params: QueryParameters = Depends(QueryParameters)
):
    return await paginate(Role.objects.exclude(name=SUPER_ROLE), params=params.params)


@router_role.get(
    '/all',
    description='角色列表',
    response_description='所有角色',
    response_model=List[RoleSerializers]
)
async def list_all_role():
    return await Role.objects.exclude(name=SUPER_ROLE).all()


@router_role.get(
    '/{r_id}',
    description='角色菜单',
    response_description='获取角色的权限',
)
async def pms_role(
    r_id: int = Path(..., ge=1, description='角色ID'),
):
    role = await Role.objects.get_or_none(id=r_id)
    if not role:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='更新角色不存在')
    pms = await role.permissions.all()
    return merge_pms(pms)


@router_role.put(
    '/pms/{r_id}',
    description='更新角色菜单',
)
async def set_pms_role(
    rp: SetRolePms,
    r_id: int = Path(..., ge=1, description='角色ID'),
):
    role = await Role.objects.get_or_none(id=r_id)
    if not role:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='更新角色不存在')
    update_data = rp.dict(exclude_unset=True)

    async def add_remove_parent_pms(son, exists, _role, _pms, _add, _del):
        intersection = [item for item in son if item in exists]
        # 添加
        if intersection and _pms not in exists:
            await _role.permissions.add(_pms)
            exists.append(_pms)
            _add += 1
        # 删除
        elif not intersection and _pms in exists:
            await _role.permissions.remove(_pms)
            exists.remove(_pms)
            _del += 1
        return _add, _del

    async with DB.transaction():
        # 更新角
        if 'value' in update_data:
            py = ''.join(lazy_pinyin(role.value))
            await role.update(**dict(
                value=update_data['value'], name=py
            ))

        # 每次带过来的格式是某个菜单的所有权限
        # 最好会包括两个ID，第一个是模块ID，第二个是菜单ID，第三个开始是功能权限ID
        pms_id = update_data.get('pms_id', None)
        if pms_id is None:
            return

        if len(pms_id) < 2:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='更新角色ID最少需要两位')

        module_id, menu_id = pms_id[:2]
        function_pms = await Permissions.objects.filter(parent_id=menu_id).all()

        # 模块和菜单权限
        del_count, add_count = 0, 0
        pms_exists = await role.permissions.all()

        # 功能权限
        for pms in function_pms:
            if pms.id in pms_id and pms not in pms_exists:
                add_count += 1
                await role.permissions.add(pms)
                pms_exists.append(pms)
            elif pms.id not in pms_id and pms in pms_exists:
                del_count += 1
                await role.permissions.remove(pms)
                pms_exists.remove(pms)

        # 模块和菜单权限删除或添加
        # 删除，功能权限不存在，且菜单或是模块权限还存在，删除菜单或模块权限
        # 添加，功能权限存在，且菜单或模块权限不存在，添加菜单或模块权限

        menu_pms = await Permissions.objects.filter(id=menu_id).first()
        add_count, del_count = await add_remove_parent_pms(
            function_pms, pms_exists, role, menu_pms, add_count, del_count
        )
        module_pms = await Permissions.objects.filter(id=module_id).first()
        add_count, del_count = await add_remove_parent_pms(
            function_pms + [menu_pms], pms_exists, role, module_pms, add_count, del_count
        )

        # # 全量更新菜单权限
        # pms = await role.permissions.all()
        # del_count, add_count = 0, 0
        # update_ids = pms_id
        # exists_ids = [item.id for item in pms]
        # remove_ids = list(set(exists_ids).difference(set(update_ids)))
        # wait_add_ids = list(set(update_ids).difference(set(exists_ids)))
        # if remove_ids:
        #     for pms in await Permissions.objects.filter(id__in=remove_ids).all():
        #         await role.permissions.remove(pms)
        #         del_count += 1
        # if wait_add_ids:
        #     for pms in await Permissions.objects.filter(id__in=wait_add_ids).all():
        #         await role.permissions.add(pms)
        #         add_count += 1

    return {'add': add_count, 'del': del_count}


# @router_role.put(
#     '/r_id}',
#     description='更新角色名字信息',
#     response_description='返回空',
# )
# async def update_role(
#         role: RoleEdited,
#         r_id: int = Path(..., ge=1, description='需要更新的角色ID'),
# ):
#     update_data = role.dict(exclude_unset=True)
#     if not update_data:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='更新数据不能为空')
#     _role = await Role.objects.get_or_none(pk=r_id)
#     if not (_role and await _role.update(**update_data)):
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='角色不存在')
#     return JSONResponse(dict(id=r_id))


@router_role.delete(
    '/{r_id}',
    description='删除权限',
    response_description='Y/N'
)
@SuperManWrapper()
async def delete_role(
        request: Request,
        r_id: int = Path(..., ge=1, description='角色ID'),
):
    """
    角色ID不存在, 成功删除掉记录数
    :param request:
    :param r_id:
    :return:
    """
    user_count = await User.objects.filter(role__id=r_id).count()
    if user_count > 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='角色关联用户资源不能删除')
    else:
        await Role.objects.filter(id=r_id).delete()
        return dict(message='删除成功')
    # 删除角色，角色关联的菜单会一并删除
