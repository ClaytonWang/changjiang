---
  ```
  在basic目录执行需要添加环境变量PYTHONPATH={source目录地址}
  使用alembic迁移，一次只能迁移一个应用，所以需要修改env.py的model引入路径。
  比如迁移应用 user_pms 只需要修改下面一行代码的user_pms替换掉。
  APP_USER_PMS_PATH = Path.joinpath(SOURCE_PATH, 'services', 'user_pms')
  ```