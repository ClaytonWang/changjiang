# -*- coding: utf-8 -*-
"""
    >File    : serialziers.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/28 14:07
"""
from pydantic import BaseModel, Field
from pydantic import validator
from typing import Optional, List
from datetime import datetime
from basic.utils.dt_format import dt_to_string
from tag.serializers import TagSampleSerializers


class ModelSerializers(BaseModel):
    id: Optional[int]
    index: Optional[int]
    title: str
    sub_title: str
    img: str
    state: str
    tag: Optional[List[TagSampleSerializers]]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    @validator('created_at', 'updated_at')
    def format_dt(cls, dt):
        return dt_to_string(dt)


class ModelDetailSerializers(ModelSerializers):
    description: Optional[str]


class ModelCreated(BaseModel):
    index: int = Field(...)
    title: str = Field(..., max_length=20)
    sub_title: str = Field(..., max_length=80)
    img: str = Field(..., max_length=280)

    description: Optional[str]
    tag: Optional[List[int]]


class ModelEdited(BaseModel):
    index: Optional[int]
    title: Optional[str] = Field(None, max_length=20)
    sub_title: Optional[str] = Field(None, max_length=80)
    img: Optional[str] = Field(None, max_length=280)

    description: Optional[str]
    tag: Optional[List[int]]
