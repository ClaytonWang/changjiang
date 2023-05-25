"""
启动入口、根路由配置
"""
from config import *
import uvicorn
from fastapi import FastAPI, Depends
from starlette.middleware.base import BaseHTTPMiddleware
from asyncpg.exceptions import PostgresError
from pydantic.error_wrappers import ValidationError
from fastapi.exceptions import RequestValidationError
from basic.middleware.rsp import add_common_response_data
from middleware.auth import verify_token, OFOAuth2PasswordBearer
from basic.middleware.exception import validation_pydantic_exception_handler
from basic.middleware.exception import validation_ormar_exception_handler
from basic.middleware.exception import ormar_db_exception_handler
from basic.middleware.exception import pg_db_exception_handler
from basic.middleware.exception import server_crash_handler
from ormar.exceptions import AsyncOrmException
from auth.auth_api import router_auth
from user.api import router_user
from role.api import router_role
from permissions.api import router_pms
from models import startup_event, shutdown_event

oauth2_scheme = OFOAuth2PasswordBearer(token_url="/v1/auth/login")


app = FastAPI(
    title='开放平台-后台管理-用户权限',
    tags=["用户权限"],
    # dependencies=[Depends(oauth2_scheme)]
)


# 配置中间件
app.add_middleware(BaseHTTPMiddleware, dispatch=verify_token)
app.add_middleware(BaseHTTPMiddleware, dispatch=add_common_response_data)

# 配置数据库连接
app.add_event_handler("startup", startup_event)
app.add_event_handler("shutdown", shutdown_event)


app.add_exception_handler(500, server_crash_handler)
app.add_exception_handler(ValidationError, validation_pydantic_exception_handler)
app.add_exception_handler(RequestValidationError, validation_ormar_exception_handler)
app.add_exception_handler(PostgresError, pg_db_exception_handler)
app.add_exception_handler(AsyncOrmException, ormar_db_exception_handler)


# 路由配置
app.include_router(router_auth, prefix='/api/v1/user/auth', tags=['登录验证'])
app.include_router(router_user, prefix='/api/v1/user/user', tags=['用户'])
app.include_router(router_role, prefix='/api/v1/user/role', tags=['角色'])
app.include_router(router_pms, prefix='/api/v1/user/pms', tags=['权限'])


if __name__ == '__main__':
    """
    SERVICE_PORT和WORKERS在config.py有引入
    """
    uvicorn.run(
        'main:app',
        host='0.0.0.0',
        port=SERVICE_PORT,
        debug=DEBUG,
        workers=WORKERS
    )
