# -*- coding: utf-8 -*-
"""
    >File    : permissions.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/24 08:34
"""
__all__ = ['PmsCategory', 'Permissions']

import ormar
from enum import Enum
from typing import Optional, List
from basic.common.base_model import DateAuditModel
from models import KJMeta
from models.user import Role


class PmsCategory(Enum):
    """
    权限分类
    """
    module = 'module'
    menu = 'menu'
    function = 'function'


class Permissions(DateAuditModel):
    """
    模块菜单权限

    层级权限关联角色，

    非层级权限关联用户
    """
    class Meta(KJMeta):
        tablename: str = "bam_permissions"

    parent_id = ormar.Integer(nullable=True, comment='父级ID')
    name: str = ormar.String(max_length=30, unique=True, comment='模块/菜单/操作标题(英文)')
    value: str = ormar.String(max_length=50, nullable=True, comment='描述')

    uri: str = ormar.String(max_length=200, nullable=True, comment='权限识别标记1')
    tag: str = ormar.String(max_length=200, nullable=True, comment='权限识别标记2')

    category: str = ormar.String(max_length=15, nullable=True, choices=list(PmsCategory))
    status: str = ormar.Boolean(default=True, comment='是否启用，默认True（启用）')
    order: str = ormar.Integer(nullable=True, comment='功能菜单排序')

    role: Optional[List[Role]] = ormar.ManyToMany(Role, related_name='permissions')

    def __repr__(self):
        return f'{self.name}__{self.value}'
