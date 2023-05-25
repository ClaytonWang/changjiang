# -*- coding: utf-8 -*-
"""
    >File    : token.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/23 13:17
"""
from __future__ import annotations
import httpx
from jose.jwt import JWTError
from fastapi.responses import Response
from fastapi import Request, status
from fastapi import HTTPException
from typing import Optional, List
from config import DO_NOT_AUTH_URI
from config import ENV_COMMON_URL, USER_PREFIX_URI
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field


AUTH_ERROR_DATA = dict(
    status_code=status.HTTP_401_UNAUTHORIZED,
    content="Invalid authentication credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


class Role(BaseModel):
    name: str
    value: str


class AccountGetter(BaseModel):
    id: int = Field(..., alias='user_id')
    username: str = Field(..., alias='user_name')
    en_name: str
    email: str
    role: Optional[List[Optional[Role]]]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


async def get_current_activate_user(
        request: Request,
):
    authorization = request.headers.get('authorization')
    permissions = request.headers.get('permissions')
    try:
        url = f'{ENV_COMMON_URL}{USER_PREFIX_URI}/user/activate'
        headers = dict(
            authorization=authorization,
            permissions=permissions if permissions is not None else ''
        )
        async with httpx.AsyncClient() as client:
            response = await client.get(url=url, headers=headers)
            json = response.json()
            ag = AccountGetter.parse_obj(json['result'])
            return ag
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='获取用户失败，请检查token')


async def verify_token(
        request: Request,
        call_next,
):
    try:
        # 资源不验证
        if request.url.path.startswith('/static/'):
            return await call_next(request)

        user = await get_current_activate_user(request)
        if user:
            request.scope['user'] = user
        else:
            return Response(**AUTH_ERROR_DATA)
        return await call_next(request)
    except (HTTPException, JWTError) as e:
        return Response(**AUTH_ERROR_DATA)


class OFOAuth2PasswordBearer(OAuth2PasswordBearer):
    def __init__(self, token_url: str):
        super().__init__(
            tokenUrl=token_url,
            scheme_name=None,
            scopes=None,
            description=None,
            auto_error=True
        )

    async def __call__(self, request: Request) -> Optional[str]:
        path: str = request.get('path')
        if path in DO_NOT_AUTH_URI:
            return ""

        try:
            state, rsp, token = await get_current_activate_user(request)
            if not state:
                raise HTTPException(**rsp)
            request.scope['user'] = rsp
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return token
