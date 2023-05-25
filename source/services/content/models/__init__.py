# -*- coding: utf-8 -*-
"""
    >File    : __init__.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/22 17:39
"""
from basic.initdb import *
import ormar
from enum import Enum
from typing import Optional, List
from basic.common.base_model import DateAuditModel


class Category(Enum):
    """
    """
    banner = 'banner'
    feature = 'feature'
    beautiful = 'beautiful'


class State(Enum):
    """
    状态
    """
    undeploy = 'undeploy'
    failed = 'failed'
    success = 'success'


class Portal(DateAuditModel):
    class Meta(KJMeta):
        tablename: str = "content_portal"
        orders_by = ['-id']

    index: int = ormar.Integer(comment='排序')
    title: str = ormar.String(max_length=20, comment='主标题')
    sub_title: str = ormar.String(max_length=80, comment='副标题')
    img: str = ormar.String(max_length=280, comment='图片链接/地址')
    link: str = ormar.String(max_length=300, nullable=True, comment='链接')
    color: str = ormar.String(max_length=30, nullable=True, comment='背景颜色')

    category: str = ormar.String(max_length=15, choices=list(Category), comment='banner/平台特点/亮点说明')
    state: str = ormar.String(max_length=15, choices=list(State), default='undeploy', commnet='状态')

    def __repr__(self):
        return f'{self.id}_{self.title}'


class TagManager(DateAuditModel):

    class Meta(KJMeta):
        tablename = "content_tag"
        orders_by = ['-id']

    tag: str = ormar.String(max_length=100, comment='标签')
    color: str = ormar.String(max_length=100, comment='颜色')

    def __repr__(self):
        return f'{self.tag}'


class Model(DateAuditModel):

    class Meta(KJMeta):
        tablename = 'content_model'
        orders_by = ['-id']

    index: int = ormar.Integer(comment='排序')
    title: str = ormar.String(max_length=20, comment='模型名称')
    sub_title: str = ormar.String(max_length=80, comment='副标题')
    img: str = ormar.String(max_length=280, comment='图片地址')
    state: str = ormar.String(choices=list(State), max_length=15, default='undeploy', commnet='状态')

    description: str = ormar.Text(nullable=True, comment='描述(整个大文本)')
    tag: Optional[List[TagManager]] = ormar.ManyToMany(to=TagManager, related_name='models')

    def __repr__(self):
        pass


class PortalDeploy(Portal):
    class Meta(KJMeta):
        tablename: str = "content_portal_deploy"
        orders_by = ['-id']

# class PortalDeploy(DateAuditModel):
#     class Meta(KJMeta):
#         tablename: str = "content_portal_deploy"
#         orders_by = ['-id']
#
#     title: str = ormar.String(max_length=20, comment='主标题')
#     sub_title: str = ormar.String(max_length=80, comment='副标题')
#     img: str = ormar.String(max_length=280, comment='图片链接/地址')
#     link: str = ormar.String(max_length=300, nullable=True, comment='链接')
#     color: str = ormar.String(max_length=30, nullable=True, comment='背景颜色')
#
#     category: str = ormar.String(max_length=15, choices=list(Category), comment='banner/平台特点/亮点说明')
#     state: str = ormar.String(max_length=15, choices=list(State), default='undeploy', commnet='状态')
#
#     def __repr__(self):
#         return f'{self.id}_{self.title}'
