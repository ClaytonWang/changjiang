# -*- coding: utf-8 -*-
"""
    >File    : __init__.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/7 15:55
"""
from multiprocessing import cpu_count
from basic.utils.log import configure_logging
from basic.common.env_variable import get_string_env, get_integer_env


"""
数据库配置
"""
DB_USER = get_string_env('DB_USER', 'root')
DB_PASSWORD = get_string_env('DB_PASSWORD', 'linshimima2!')
DB_NAME = get_string_env('DB_NAME', 'changjiang_dev')
DB_HOST = get_string_env('DB_HOST', '123.60.43.172')
DB_PORT = get_string_env('DB_PORT', '5432')


"""
项目基础信息配置
"""
DEBUG = True
DO_NOT_AUTH_URI = ['/api/v1/user/auth/login', '/docs', '/openapi', '/openapi.json']

WORKERS = cpu_count() * 2
SERVICE_PORT = get_integer_env('SERVICE_PORT', 8000)
DEBUG = True if 'DEV' == get_string_env('ENV', 'DEV') else False


SECRET_KEY = "dc393487a84ddf9da61fe0180ef295cf0642ecbc5d678a1589ef2e26b35fce9c"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8


"""
日志配置
"""
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
    },

    "handlers": {
        "console": {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG' if DEBUG else 'INFO',
            'formatter': 'verbose',
        }
    },
    "loggers": {
        'info': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'DEBUG' if DEBUG else 'INFO',
        },
        'sqlalchemy.engine': {
             'handlers': ['console'],
             'propagate': True,
             'level': 'DEBUG' if DEBUG else 'INFO',
        },
        'databases': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'DEBUG' if DEBUG else 'INFO',
        },
    },
}
configure_logging('logging.config.dictConfig', LOGGING)

ENV_COMMON_URL = get_string_env('ENV_COMMON_URL', 'http://121.36.41.231:30767')
USER_PREFIX_URI = get_string_env('USER_PREFIX_URI', '/api/v1/user')
