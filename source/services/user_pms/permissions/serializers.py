# -*- coding: utf-8 -*-
"""
    >File    : permissions_serializers.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/24 09:04
"""
from typing import Optional
from pydantic import BaseModel
from pydantic import Field
from enum import Enum


class PmsRspMode(str, Enum):
    string = 'string',
    tree = 'tree'


class PmsListQueryParams(BaseModel):
    mode: PmsRspMode = PmsRspMode.string
    role: Optional[str]
    code: Optional[str]


class PmsListSerializers(BaseModel):
    id: int
    name: str = ''
    value: Optional[str]

    parent_id: Optional[int]
    name: Optional[str]
    value: Optional[str]

    uri: Optional[str]
    tag: Optional[str]

    category: Optional[str]
    status: Optional[str]
    order: Optional[str]

    class Config:
        orm_mode = True


class PmsDetailSerializers(PmsListSerializers):
    pass


class PmsCreatedSerializer(BaseModel):

    parent_id: Optional[int] = Field(None, description='父级ID')
    name: str = Field(max_length=30, description='模块/菜单/操作标题')
    value: Optional[str] = Field(max_length=50, description='描述')

    uri: Optional[str] = Field(None, max_length=200, description='权限识别标记1')
    tag: Optional[str] = Field(None, max_length=200, description='权限识别标记2')

    category: Optional[str] = Field(None, max_length=15, description='权限类型')


class PmsEditSerializer(PmsCreatedSerializer):
    name: str = Field(None, max_length=30, description='模块/菜单/操作标题')
    value: Optional[str] = Field(None, max_length=50, description='描述')
