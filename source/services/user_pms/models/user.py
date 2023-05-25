# -*- coding: utf-8 -*-
"""
    >File    : users.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/10/11 09:27
"""
__all__ = ['Role', 'User', 'UserCategory']


import ormar
from enum import Enum
from typing import Optional, List
from basic.common.base_model import DateModel
from basic.common.base_model import DateAuditModel
from models import KJMeta


class UserCategory(Enum):
    """
    权限分类
    """
    manager = 'manager'
    customer = 'customer'


class Role(DateModel):
    class Meta(KJMeta):
        tablename: str = "bam_role"
        orders_by = ['-id']

    id: int = ormar.Integer(primary_key=True)
    name = ormar.String(max_length=30, comnet='角色名(英文)')
    value = ormar.String(max_length=30, default='', unique=True, nullable=True, comment='说明')
    # parent_id = ormar.Integer(nullable=True, comment='父级ID')  # 角色继承使用

    def __repr__(self):
        return f'{self.name}_{self.value}'


class User(DateAuditModel):
    class Meta(KJMeta):
        tablename: str = "bam_user"
        orders_by = ['-id']

    category: str = ormar.String(max_length=15, choices=list(UserCategory), default='manager')
    username: str = ormar.String(max_length=80, comment='用户名')
    en_name: str = ormar.String(max_length=20, comment='英文用户名', unique=True)
    email: str = ormar.String(max_length=80, comment='邮箱', unique=True)
    password: str = ormar.String(max_length=255, comment='密码')
    first_name: str = ormar.String(max_length=20, nullable=True)
    last_name: str = ormar.String(max_length=60, nullable=True)
    phone: str = ormar.String(max_length=12, nullable=True)
    is_delete: bool = ormar.Boolean(default=False, comment='是否删除')

    role: Optional[List[Role]] = ormar.ManyToMany(to=Role, related_name='users')

    def __repr__(self):
        return f'{self.username}_{self.email}'
