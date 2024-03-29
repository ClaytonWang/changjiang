# -*- coding: utf-8 -*-
"""
    >File    : services.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/29 16:48
"""
from fastapi import HTTPException, status
from models import Role, User, Permissions
from typing import List, Any


async def get_role_objects(role_ids: List):
    return await Role.objects.filter(id__in=role_ids).all()


async def set_role_of_user(user: User, role_ids: List, is_clear=False) -> Any:
    roles = await get_role_objects(role_ids)
    if len(roles) != len(role_ids):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='角色ID查询失败')

    if is_clear:
        await user.role.clear()

    for role in roles:
        await user.role.add(role)


async def update_user_of_project(project_ids: List[int], user: User, delete_old: bool = False):
    """
    更新项目成员，

    删掉所有旧的重新添加，TODO：已经存在的不删除重新添加，新增新加，删除去掉
    :param project_ids:
    :param user:
    :param delete_old: 删除旧数据
    :return:
    """
    # TODO 异常回滚
    if delete_old:
        await user.projects.clear()
        await OperationPms.objects.filter(user=user).delete()

    projects = await Project.objects.filter(id__in=project_ids).all()
    # 普通用户项目权限默认编辑
    edit_pms = await Permissions.objects.get_or_none(code='00030002')
    exist_pms = await OperationPms.objects.filter(project__in=project_ids, user=user).all()
    exist_ids = set([x.project.id for x in exist_pms])
    pms_list = []
    new_proj_ids = []
    for _project in projects:
        await _project.member.add(user)
        # 添加普通用户权限
        if _project.id not in exist_ids:
            pms_list.append(OperationPms(project=_project.id, user=user.id))
            new_proj_ids.append(_project.id)
    if pms_list:
        await OperationPms.objects.bulk_create(pms_list)
        add_pms = await OperationPms.objects.filter(project__in=new_proj_ids, user=user).all()
        for _pms in add_pms:
            await _pms.permissions.add(edit_pms)
