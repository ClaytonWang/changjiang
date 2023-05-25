# -*- coding: utf-8 -*-
"""
    >File    : services.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/28 17:38
"""
from typing import List, Any
from models import Portal
from fastapi import HTTPException, status
from basic.initdb import DB


async def update_portal_instance(model_object: List[Any], request, category):

    if len(model_object) < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='至少保留一条')

    result = []
    for item in model_object:
        data = item.dict()
        data['category'] = category
        data['created_by'] = request.user.id
        data['updated_by'] = request.user.id
        result.append(Portal(**data))

    async with DB.transaction():
        await Portal.objects.delete(category=category)
        await Portal.objects.bulk_create(result)

    return result


async def portal_update(portal, portal_id):
    update_data = portal.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='更新数据不能为空')
    _portal = await Portal.objects.get_or_none(pk=portal_id)
    if not _portal:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='不存在')

    await _portal.update(**update_data)

