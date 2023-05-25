# syntax=docker/dockerfile:1.4

ARG BASE_IMG=containers.git.digitalbrain.cn/engineering-group/changjiang.base-user:2023-03-10.6
#ARG APP_PATH=services/user
FROM $BASE_IMG

COPY services/user_pms .
COPY basic /source/basic/

# ENTRYPOINT python3 main.py
CMD ["python3", "main.py"]
