# syntax=docker/dockerfile:1.4

ARG BASE_IMG=containers.git.digitalbrain.cn/engineering-group/changjiang.base-content:2023-03-10.4
#ARG APP_PATH=services/user
FROM $BASE_IMG

COPY services/content .
COPY basic /source/basic/

ENTRYPOINT python3 main.py
#CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port=80"]