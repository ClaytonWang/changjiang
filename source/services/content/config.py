# -*- coding: utf-8 -*-
"""
    >File    : config.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/02/06 15:44
"""
import os
import sys
import yaml
import importlib
from pathlib import Path


"""
项目基础信息配置
"""

HUAWEI_OBS_BUCKET = 'eicd'
HUAWEI_OBS_ACCESS_ID = 'W8NN2INCLYIP47JNAN78'
HUAWEI_OBS_ACCESS_SECRET = 'kQkU8HINWJ2CSTdc9isfgLFOhgozUbHz2XgjYxOP'
HUAWEI_OBS_ENDPOINT = 'obs.cn-east-3.myhuaweicloud.com'
APP_NAME = Path(__file__).parent.name
BASIC_PATH = Path.joinpath(Path(__file__).parent.parent.parent, 'basic')
SOURCE_PATH = Path.joinpath(Path(BASIC_PATH).parent)
sys.path.insert(0, SOURCE_PATH.__str__())
K8S_YAML_CONFIG_PATH = '/etc/changjiang/config.yaml'
COMMON_CONFIG_PATH = f'basic.config'
SUPER_ROLE = 'superadmin'


from basic.common.env_variable import get_string_env, get_bool_env
DEBUG = True if 'DEV' == get_string_env('ENV', 'DEV') else False
# 是否开启接口权限校验
# headers 里添加 permissions 参数
PERMISSIONS = get_bool_env('PERMISSIONS', False)

"""
加载公用配置 
"""
try:
    common_module = importlib.import_module(COMMON_CONFIG_PATH)
    for key in common_module.__dict__:
        if key.startswith('__'):
            continue
        val = getattr(common_module, key)
        locals().__setitem__(key, val)
except ModuleNotFoundError:
    pass


"""
加载服务器配置
"""
if os.path.exists(K8S_YAML_CONFIG_PATH):
    try:
        with open(K8S_YAML_CONFIG_PATH) as f:
            data = yaml.load(f, Loader=yaml.FullLoader)
            locals().update(**data)
    except Exception as e:
        print(f'Loading k8s config error. {e}')
