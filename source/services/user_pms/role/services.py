# -*- coding: utf-8 -*-
"""
    >File    : services.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/10 10:26
"""
import inspect
import asyncio
import functools
from fastapi import Request, Response, HTTPException, status
from typing import Sequence, Union, Optional, Callable, Any, List
from models.user import Role
from models.permissions import Permissions
from config import SUPER_ROLE
from permissions.serializers import PmsDetailSerializers


class SuperManWrapper:
    """
    超级管理员
    """

    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    def __call__(self, func: Optional[Callable] = None):

        async def back_request(request: Request) -> Request:
            """依赖项内部执行逻辑处理"""
            return request

        if func is None:
            """
            当作依赖使用，返回的是callable object
            """
            return back_request

        if asyncio.iscoroutinefunction(func):
            @functools.wraps(func)
            async def async_wrapper(*args: Any, **kwargs: Any) -> Response:
                try:
                    request = kwargs.get('request')
                    if request.method in ('PUT', 'PATCH', 'DELETE'):
                        """
                        带有ID，raise exception
                        """
                        role_id = int(request.path_params.get('r_id', -1))
                        super_role = await Role.objects.get_or_none(id=role_id, name=SUPER_ROLE)
                        if super_role:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"不能编辑/删除角色{SUPER_ROLE}"
                            )

                    # # 查当前被装饰的函数有哪些参数值信息  # 查验当前函数有哪些参数值得传入
                    # sig = inspect.signature(func)
                    # for idx, parameter in enumerate(sig.parameters.values()):
                    #     print(idx, parameter, parameter.name)
                    return await func(*args, **kwargs)
                # except Exception as e:
                #     print(e)
                finally:
                    pass

            return async_wrapper
        else:
            @functools.wraps(func)
            def sync_wrapper(*args: Any, **kwargs: Any) -> Response:
                if self.roles and self.get_user_roles not in self.roles:
                    raise Exception("您当前的角色不允许访问滴！！！")
                if self.permissions and self.get_user_permissions not in self.roles:
                    raise Exception("您当前的没有这个权限标记滴！！！！！！")
                print("装饰同步函数！！可以在这里做权限校验逻辑", self.roles)
                return func(*args, **kwargs)
            return sync_wrapper


def merge_children(_level, _pms):
    _result = []
    if str(_level) not in _pms:
        return _result

    for _l_item in _pms[_level]:
        _result.append(_l_item)
        if str(_l_item['id']) in _pms:
            _result[-1]['children'] = merge_children(str(_l_item['id']), _pms)
    return _result


def merge_pms(pms: List[Permissions]) -> list:
    """
    一次查询所有的菜单，根据逻辑来拼接
    :param pms:
    :return:
    """
    new_pms = dict()
    for item in pms:
        if item.parent_id in (None, ''):
            item.parent_id = 0
            parent_id = str(item.parent_id)
        else:
            parent_id = str(item.parent_id)
        if parent_id in new_pms:
            new_pms[parent_id] = new_pms[parent_id] + [PmsDetailSerializers.from_orm(item).dict()]
        else:
            new_pms[parent_id] = [PmsDetailSerializers.from_orm(item).dict()]

    # 权限是有顶层的权限
    top_level = str(0)
    if not new_pms or top_level not in new_pms:
        # raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='没有查到权限')
        return []

    result = merge_children(top_level, new_pms)
    # from permissions.services import join_pms_to_string
    # rr = join_pms_to_string(result)
    return result
