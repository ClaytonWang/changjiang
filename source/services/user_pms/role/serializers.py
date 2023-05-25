# -*- coding: utf-8 -*-
"""
    >File    : role_serializers.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/24 09:04
"""
from pydantic import BaseModel, Field
from pydantic import validator
from typing import Optional, List
from datetime import datetime
from basic.utils.dt_format import dt_to_string


class RoleSerializers(BaseModel):
    id: int = None
    name: str = ''
    value: Optional[str] = ''
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    @validator('created_at', 'updated_at')
    def format_dt(cls, dt):
        return dt_to_string(dt)


class RoleListSerializers(BaseModel):
    id: int = None
    name: str = ''
    value: Optional[str] = ''


class RoleCreated(BaseModel):
    value: str = Field(..., max_length=30)


class RoleEdited(RoleCreated):
    pass


class SetRolePms(BaseModel):
    value: str = Field(None, max_length=30)
    pms_id: List[int] = []

