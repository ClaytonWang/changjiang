"""
启动入口、根路由配置
"""
from config import *
import uvicorn
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from asyncpg.exceptions import PostgresError
from pydantic.error_wrappers import ValidationError
from fastapi.exceptions import RequestValidationError
from basic.middleware.rsp import add_common_response_data
from basic.middleware.account_getter import OFOAuth2PasswordBearer
from basic.middleware.account_getter import verify_token
from basic.middleware.exception import validation_pydantic_exception_handler
from basic.middleware.exception import validation_ormar_exception_handler
from basic.middleware.exception import ormar_db_exception_handler
from basic.middleware.exception import pg_db_exception_handler
from basic.middleware.exception import server_crash_handler
from ormar.exceptions import AsyncOrmException
from portal.api import router_portal
from tag.api import router_tag
from upload.api import router_upload
from model.api import router_model
from models import startup_event, shutdown_event


app = FastAPI(
    title='开放平台-后台管理-用户权限',
    tags=["用户权限"],
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
app.include_router(router_portal, prefix='/api/v1/content/portal', tags=['首页'])
app.include_router(router_tag, prefix='/api/v1/content/tag', tags=['标签'])
app.include_router(router_upload, prefix='/api/v1/content/upload', tags=['上传'])
app.include_router(router_model, prefix='/api/v1/content/model', tags=['模型'])
# app.mount('/static', StaticFiles(directory=STATIC_DIR, html=True), name='static')


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
