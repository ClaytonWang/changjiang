# -*- coding: utf-8 -*-
"""
    >File    : serializers.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/28 17:30
"""

from pydantic import BaseModel, Field
from pydantic import validator
from typing import Optional, List
from datetime import datetime
from basic.utils.dt_format import dt_to_string
from tag.serializers import TagSampleSerializers


class BaseCreated(BaseModel):
    index: int = Field(...)
    title: str = Field(..., max_length=20)
    sub_title: str = Field(..., max_length=80)
    img: str = Field(..., max_length=280)


class BannerCreated(BaseCreated):
    link: Optional[str] = Field(None, max_length=300)


class BannerEdited(BaseCreated):
    title: Optional[str]
    sub_title: Optional[str]
    img: Optional[str]
    link: Optional[str]


class FeatureCreated(BaseCreated):
    color: str = Field(..., max_length=30)


class FeatureEdited(BaseCreated):
    title: Optional[str]
    sub_title: Optional[str]
    img: Optional[str]
    color: Optional[str]


class BeautifulCreated(BaseCreated):
    pass


class BeautifulEdited(BaseCreated):
    title: Optional[str]
    sub_title: Optional[str]
    img: Optional[str]


class PortalList(BaseModel):
    index: Optional[int]
    id: Optional[int]
    title: Optional[str]
    sub_title: Optional[str]
    img: Optional[str]
    link: Optional[str]
    color: Optional[str]
    category: Optional[str]
    state: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    @validator('created_at', 'updated_at')
    def format_dt(cls, dt):
        return dt_to_string(dt)
