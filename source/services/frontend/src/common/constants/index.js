/**
 * @Author: liguanlin<guanlin.li@digitalbrain.cn> junshi clayton.wang@digitalbrain.cn
 * @Date: 2023-01-31 15:07:28
 * @LastEditors: junshi clayton.wang@digitalbrain.cn
 * @LastEditTime: 2023-02-01 10:21:58
 * @FilePath: /frontend/src/common/constants/index.js
 * @Description: Global Constants
 */
// 用户角色
export const USER_ROLE = {
  admin: '超级管理员',
  owner: '项目负责人',
  user: '普通用户',
};
export const ADMIN = 'admin';
export const OWNER = 'owner';
export const USER = 'user';

// 计划名词
export const PLANS_MAP = {
  name: '计划名称',
  creator: '创建人',
  createTime: '创建时间',
  lastEditTime: '最后编辑时间',
  organization: '组织',
  status: '状态',
  saveCost: '预计节省',
  users: '普通用户',
};
// 正则
export const EMAIL_REG = /^[\w._]+@[\w-]+(\.[\w]+)*(\.[\w]{2,6})$/;
// 默认密码
export const DEFAULT_PASSWORD = 'syy12345';
// Modal Type
export const INFO = 'info';
export const PASSWORD = 'password';
export const CREATE = 'create';
export const EDIT = 'edit';
export const UPDATE = 'update';
export const COPY = 'copy';
export const DEBUG = '调试';

export const STATUS = {
  undeploy: '未发布',
  success: '已发布',
  failed: '发布失败',
};

export const START = 'start';
export const STOP = 'stop';
export const UNDEPLOY = 'undeploy';

export const PORTALITEM = {
  BANNER: 'banner',
  FEATURE: 'feature',
  SPECIAL: 'special',
};
