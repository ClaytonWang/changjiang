# -*- coding: utf-8 -*-
"""
    >File    : api.py
    >Author  : YJD
    >Mail    : jindu.yin@digitalbrain.cn
    >Time    : 2023/2/28 11:12
"""
import asyncio
from fastapi import APIRouter
from fastapi import UploadFile, HTTPException, status
from concurrent.futures import ThreadPoolExecutor
from fastapi.responses import JSONResponse
from upload.services import upload_obs

router_upload = APIRouter()


@router_upload.post(
    '/obs',
    description='上传图片',
)
async def upload_huawei_obs(
        file: UploadFile,
):
    try:
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as pool:
            object_url = await loop.run_in_executor(pool, upload_obs, file)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f'文件上传失败：{str(e)}'
        )
    finally:
        await file.close()
    return JSONResponse(dict(url=object_url))


# @router_upload.post(
#     '/local',
#     description='上传图片',
# )
# async def save_local(
#         request: Request,
#         file: File,
# ):
#     try:
#         _fn = get_hash_filename(file.filename)
#         file_path = pathlib.Path(STATIC_DIR, _fn)
#         async with aiofiles.open(file_path, 'wb') as f:
#             while chunk := await file.read(CHUNK_SIZE):
#                 await f.write(chunk)
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST, detail=f'文件上传失败：{str(e)}')
#     finally:
#         await file.close()
#
#     return JSONResponse(dict(file=f'{request.base_url.__str__()}static/{_fn}'))
