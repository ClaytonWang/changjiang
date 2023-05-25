# -*- coding: utf-8 -*-
"""
    >File    : api.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/22 17:22
"""
from fastapi import APIRouter
from fastapi import Request, Depends, Path, HTTPException, status
from fastapi.responses import JSONResponse
from model.serialziers import ModelCreated, ModelSerializers, ModelEdited
from model.serialziers import ModelDetailSerializers
from models import Model, TagManager
from basic.common.paginate import Page
from basic.common.paginate import paginate
from basic.common.query_filter_params import QueryParameters
from basic.initdb import DB
router_model = APIRouter()


@router_model.post(
    "",
    response_model=ModelSerializers,
    description='创建模型',
)
async def add_model(request: Request, model: ModelCreated):
    data = model.dict(exclude_unset=True)
    data['created_by'] = request.user.id
    data['updated_by'] = request.user.id

    tag = data.pop('tag', [])
    async with DB.transaction():
        instance = await Model.objects.create(**data)
        for item in await TagManager.objects.filter(id__in=tag).all():
            await instance.tag.add(item)
    return instance


@router_model.get(
    "",
    response_model=Page[ModelSerializers]
)
async def model_list(
    params: QueryParameters = Depends(QueryParameters)
):
    
    return await paginate(
        Model.objects.select_related('tag').filter().order_by(['index', '-id']),
        params=params.params
    )


@router_model.get(
    "/{model_id}",
    response_model=ModelDetailSerializers
)
async def model_detail(
        model_id: int = Path(...)
):
    model = await Model.objects.select_related('tag').get_or_none(id=model_id)
    if model:
        return model
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'{model_id}无效')


@router_model.put(
    '/{model_id}'
)
async def model_update(
        model: ModelEdited,
        model_id: int = Path(..., ge=1, description='id')
):
    update_data = model.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='更新数据不能为空')
    _model = await Model.objects.get_or_none(pk=model_id)
    if not _model:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='不存在')

    # 更新标签
    async with DB.transaction():
        if 'tag' in update_data:
            tag = update_data.pop('tag')
            await _model.tag.clear()
            for item in await TagManager.objects.filter(id__in=tag).all():
                await _model.tag.add(item)

        await _model.update(**update_data)
    return JSONResponse(dict(id=model_id))


@router_model.delete(
    '/{model_id}',
    description='删除模型',
    status_code=status.HTTP_200_OK,
)
async def delete_model(
        model_id: int = Path(..., ge=1, description='ID')
):
    model = await Model.objects.get(id=model_id)
    if model:
        async with DB.transaction():
            await model.tag.clear()
            await model.delete()
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'{model_id}无效')


@router_model.post(
    '/deploy/{model_id}',
    description='发布接口'
)
async def model_deploy(
        model_id: int = Path(..., ge=1, description='id'),
):
    return JSONResponse(dict())
