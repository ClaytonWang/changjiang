# -*- coding: utf-8 -*-
"""
    >File    : serializers.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/24 15:37
"""
from pydantic import BaseModel, Field
from pydantic import validator
from typing import Optional, List
from datetime import datetime
from basic.utils.dt_format import dt_to_string


class TagSerializers(BaseModel):
    id: Optional[int]
    tag: Optional[str]
    color: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    @validator('created_at', 'updated_at')
    def format_dt(cls, dt):
        return dt_to_string(dt)


class TagAllSerializers(BaseModel):
    id: Optional[int]
    tag: Optional[str]


class TagSampleSerializers(BaseModel):
    id: Optional[int]
    tag: Optional[str]
    color: Optional[str]


class TagCreated(BaseModel):
    tag: str = Field(..., max_length=100)
    color: str = Field(..., max_length=100)


class TagEdited(BaseModel):
    tag: Optional[str]
    color: Optional[str]
