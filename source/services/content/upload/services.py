# -*- coding: utf-8 -*-
"""
    >File    : service.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/27 19:24
"""
import time
import hashlib
from fastapi import UploadFile
from obs import ObsClient, AppendObjectContent
from config import HUAWEI_OBS_ACCESS_ID, HUAWEI_OBS_ACCESS_SECRET, HUAWEI_OBS_ENDPOINT, HUAWEI_OBS_BUCKET
CHUNK_SIZE = 1024 * 1024


class HuaweiOBS:

    def __init__(self):
        self.obs_client = None

    def __enter__(self):
        self.obs_client = ObsClient(
            access_key_id=HUAWEI_OBS_ACCESS_ID,
            secret_access_key=HUAWEI_OBS_ACCESS_SECRET,
            server=HUAWEI_OBS_ENDPOINT,
        )
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.obs_client and self.obs_client.close()


def get_hash_filename(filename: str) -> str:
    suffix = filename.split('.')[-1]
    has = hashlib.sha256(filename.encode('utf-8'))
    has.update(filename.encode('utf-8'))
    has.update(str(time.time()).encode('utf-8'))
    _fn = has.hexdigest() + '.' + suffix
    return _fn


def upload_obs(file: UploadFile) -> str:
    object_url = None
    content = AppendObjectContent()
    next_position = 0
    new_filename = get_hash_filename(file.filename)

    with HuaweiOBS() as obs:
        while True:
            _bytes = file.file.read(CHUNK_SIZE)
            if not _bytes:
                break
            content.content = _bytes
            content.position = next_position
            rsp = obs.obs_client.appendObject(HUAWEI_OBS_BUCKET, new_filename, content=content)
            if rsp.status >= 300:
                raise Exception(rsp.errorMessage)
            next_position = rsp.body.get('nextPosition')
            object_url = rsp.body.get('objectUrl')

    return object_url
