# -*- coding: utf-8 -*-
"""
    >File    : __init__.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/7 15:55
"""
from ormar import ModelMeta
import databases
import sqlalchemy
from config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
DB_CONN = f'{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

DB_POSTGRESQL_CONN = f'postgresql://{DB_CONN}'

DB = databases.Database(DB_POSTGRESQL_CONN)
META = sqlalchemy.MetaData()
engine = sqlalchemy.create_engine(DB_POSTGRESQL_CONN)
META.create_all(engine)


class KJMeta(ModelMeta):
    metadata = META
    database = DB


async def startup_event() -> None:
    if not DB.is_connected:
        await DB.connect()


async def shutdown_event() -> None:
    if DB.is_connected:
        await DB.disconnect()

