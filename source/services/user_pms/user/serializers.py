# -*- coding: utf-8 -*-
"""
    >File    : serializers.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/10/13 07:12
"""
from typing import Optional, List
from pydantic import Field
from pydantic import EmailStr
from pydantic import validator
from pydantic import BaseModel
from datetime import datetime
from basic.utils.dt_format import dt_to_string
from permissions.serializers import PmsListSerializers
from auth.services import hash_password
from role.serializers import RoleSerializers


class Login(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    token: str
    token_type: str


class UserCreated(BaseModel):
    """
    字段的顺序会影响 validator的values参数的值
    """
    # confirm_password: str = Field(..., min_length=8, max_length=255)
    email: EmailStr
    role: Optional[List[int]] = Field(..., description='角色ID')
    username: str = Field(..., max_length=80)
    password: str = Field(..., min_length=8, max_length=255)

    @validator('password')
    def set_password(cls, val, values, **kwargs):
        # cp = 'confirm_password'
        # if cp not in values or val != values[cp]:
        #     raise ValueError('两次密码不一致')
        return hash_password(val)


class UserEdited(BaseModel):
    username: str = Field(None, max_length=80)
    role: Optional[List[int]] = Field(None, description='角色ID')
    old_password: Optional[str] = Field(None, min_length=8, max_length=255)
    password: Optional[str] = Field(None, min_length=8, max_length=255)

    @validator('password')
    def set_password(cls, pwd):
        return hash_password(pwd)


class UserItem(BaseModel):
    id: int
    username: str = None
    email: str = None
    en_name: str = None


class UserList(UserItem):
    role: Optional[List[RoleSerializers]]
    # role: Optional[list]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    @validator('created_at', 'updated_at')
    def format_dt(cls, dt):
        return dt_to_string(dt)

    # @validator('role')
    # def fmt_role(cls, role):
    #     if not role:
    #         return []
    #     s = [item['value'] for item in role]
    #     return s


class AccountInfo(UserList):
    role: Optional[List[RoleSerializers]] = None
    permissions = []

    class Config:
        orm_mode = True
