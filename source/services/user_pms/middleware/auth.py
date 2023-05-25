# -*- coding: utf-8 -*-
"""
    >File    : token.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/23 13:17
"""
from jose import jwt
from fastapi import Request, Response, Header, status
from fastapi import HTTPException
from typing import Optional
from config import SECRET_KEY
from config import DO_NOT_AUTH_URI
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.utils import get_authorization_scheme_param
from jose.jwt import JWTError


AUTH_ERROR_DATA = dict(
    status_code=status.HTTP_401_UNAUTHORIZED,
    content="Invalid authentication credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(email=Optional[str]):
    from services.user_pms.models import User
    return await User.objects.select_related('role').get_or_none(email=email)


async def get_user_and_verify_permission(
        request: Request,
        email=Optional[str]
):
    from config import PERMISSIONS
    from services.user_pms.models import User, Permissions
    fields = ['id', 'name', 'value']
    user = await User.objects.select_related('role').get_or_none(email=email)
    if not PERMISSIONS:
        return True, user

    # pms2 = await Permissions.objects.select_related('role').filter(
    #     role__id__in=[item.id for item in user.role]
    # ).values_list(fields)

    forbidden_rsp_data = dict(
        status_code=status.HTTP_403_FORBIDDEN,
        content="Forbidden",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 判断Header权限
    pms_key = 'permissions'
    if pms_key not in request.headers.keys():
        return False, forbidden_rsp_data

    # 查询权限和判断
    pms2 = await Permissions.objects.filter(
        permissionsrole__role__id__in=[item.id for item in user.role]
    ).values_list(fields)
    if not [item[1] for item in pms2 if item[1] == request.headers[pms_key]]:
        return False, forbidden_rsp_data

    return True, user


async def decode_token(request) -> tuple:
    """
    解析token，返回User
    :param request:
    :return:
    """
    authorization: str = request.headers.get('authorization')
    scheme, param = get_authorization_scheme_param(authorization)
    if not authorization or scheme.lower() != "bearer":
        return False, AUTH_ERROR_DATA, param

    data = jwt.decode(param, key=SECRET_KEY)
    sub = data.get('sub') if 'sub' in data else ''
    state, user_or_err_rsp_data = await get_user_and_verify_permission(email=sub, request=request)
    return state, user_or_err_rsp_data, param


async def verify_token(
        request: Request,
        call_next,
):
    path: str = request.get('path')
    # 登录接口、docs文档依赖的接口，不做token校验
    if path in DO_NOT_AUTH_URI:
        return await call_next(request)
    else:
        try:
            state, rsp_data, _ = await decode_token(request)
            if not state:
                return Response(**rsp_data)

            if state and rsp_data:
                request.scope['user'] = rsp_data
            else:
                return Response(**AUTH_ERROR_DATA)
            return await call_next(request)
        except JWTError:
            return Response(**AUTH_ERROR_DATA)


class OFOAuth2PasswordBearer(OAuth2PasswordBearer):
    """"""

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
            state, rsp, token = await decode_token(request)
            if not state:
                raise HTTPException(**rsp)
            request.scope['user'] = rsp
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return token
