# -*- coding: utf-8 -*-
"""
    >File    : exception.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/27 10:36
"""
import logging
from fastapi import status
from fastapi.responses import JSONResponse
from asyncpg.exceptions import UniqueViolationError, ForeignKeyViolationError, DataError
from ormar.exceptions import NoMatch
logger = logging.getLogger('info')


def validation_pydantic_exception_handler(request, exc):
    """
    :param request:
    :param exc:
    :return:
    """
    return JSONResponse(str(exc), status_code=status.HTTP_400_BAD_REQUEST)


def validation_ormar_exception_handler(request, exc):
    """
    :param request:
    :param exc:
    :return:
    """
    return JSONResponse(str(exc), status_code=status.HTTP_400_BAD_REQUEST)


def pg_db_exception_handler(request, exc):
    """
    :param request:
    :param exc:
    :return:
    """
    if isinstance(exc, (
            UniqueViolationError,
            ForeignKeyViolationError,
            DataError,
    )):
        return JSONResponse(
            exc.detail if hasattr(exc, 'detail')
            and getattr(exc, 'detail') is not None
            and len(str(exc.detail)) else str(exc),
            status_code=status.HTTP_400_BAD_REQUEST
        )
    return exc


def ormar_db_exception_handler(request, exc):
    if isinstance(exc, (NoMatch, )):
        return JSONResponse('No Match', status_code=status.HTTP_400_BAD_REQUEST)

    return exc


def server_crash_handler(request, exc):
    err = '\n' + \
          '*' * 80 + \
          '\n' + 'Internal Server Error \n' + \
          str(exc) + '\n' + \
          '*' * 80
    logger.error(err)
    msg = 'The application happened an unknown error internally, ' \
          'we have received the error message and ' \
          'will fix it as soon as possible'

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=dict(
            success=False,
            message=msg,
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            result='',
        )
    )
