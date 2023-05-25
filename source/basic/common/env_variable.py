# -*- coding: utf-8 -*-
"""
    读取环境变量
    >File    : env_variable.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2022/11/27 10:39
"""
from distutils import util
import os


def get_integer_env(name: str, default: int = None) -> int:
    var = os.getenv(name.upper())
    return int(var) if var is not None else default


def get_string_env(name: str, default: str = None) -> str:
    var = os.getenv(name.upper())
    return var if var is not None else default


def get_bool_env(name: str, default: bool = None) -> bool:
    var = get_string_env(name)
    return bool(util.strtobool(var)) if var is not None else default
