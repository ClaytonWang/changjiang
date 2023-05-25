/*
 * @Author: junshi clayton.wang@digitalbrain.cn
 * @Date: 2023-02-17 17:36:49
 * @LastEditors: junshi clayton.wang@digitalbrain.cn
 * @LastEditTime: 2023-02-20 19:01:57
 * @FilePath: /changjiang/source/services/frontend/src/common/utils/config.js
 * @Description:
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PERMISSION_MAP = require('./permissions');
const APIV1 = '/api/v1';

module.exports = {
  name: `决策智能开放平台`,
  footerText: 'Shanghai Digital Brain.Lmt.',
  logo: 'static/logo.svg',
  CORS: [],
  apiPrefix: APIV1,
  apiUriParamsPattern: /:([_a-zA-Z0-9]+)/g,
  api: {
    // login
    login: 'post|/user/auth/login',
    logout: 'put|/user/auth/logout',

    // role
    roleListAll: 'get|/user/role/all',
    roleList: 'get|/user/role',
    roleDetail: 'get|/user/role/:id',
    roleDelete: 'delete|/user/role/:id',
    roleUpdate: 'put|/user/role/pms/:id',
    roleCreate: 'post|/user/role',

    // permission
    pmsList: 'get|/user/pms/tree',
    pmsUpdate: 'put|/user/role/pms/:id',

    // user
    bamUsersList: 'get|/user/user',
    bamUsersCreate: 'post|/user/user',
    bamUsersUpdate: 'put|/user/user/:id',
    bamUsersDelete: 'delete|/user/user/:id',
    settingsAccount: 'get|/user/user/account',

    // portal
    portalList: 'get|/content/portal',
    bannerCreate: 'post|/content/portal/banner',
    specialCreate: 'post|/content/portal/btf',
    featureCreate: 'post|/content/portal/feature',
    publishPortal: 'post|/content/portal/deploy',

    // tag
    tagList: 'get|/content/tag',
    tagListAll: 'get|/content/tag/all',
    tagCreate: 'post|/content/tag',
    tagUpdate: 'put|/content/tag/:id',
    tagDelete: 'delete|/content/tag/:id',

    // model
    modelDetail: 'get|/content/model/:id',
    modelList: 'get|/content/model',
    modelCreate: 'post|/content/model',
    modelUpdate: 'put|/content/model/:id',
    modelDelete: 'delete|/content/model/:id',
    modelPublish: 'post|/content/model/deploy/:id',
    uploadImg: 'post|/content/upload/obs',
  },
  breadcrumbConfig: {
    '/system/user': '用户管理',
    '/system/role': '角色管理',

    '/content/portal': '首页管理',
    '/content/portal/banner/edit': '编辑Banner',
    '/content/portal/feature/edit': '编辑平台特点',
    '/content/portal/special/edit': '编辑平台亮点',

    '/content/model': '模型管理',
    '/content/model/create': '新建模型',
    '/content/model/edit': '编辑模型',

    '/content/tag': '标签管理',
  },
  menuItemsConfig: [
    {
      key: 'system',
      label: '系统管理',
      icon: 'settings',
      permission: PERMISSION_MAP.SYSTEM,
      children: [
        {
          key: 'system.user',
          label: '用户管理',
          permission: PERMISSION_MAP.SYSTEM_USER,
        },
        {
          key: 'system.role',
          label: '权限管理',
          permission: PERMISSION_MAP.SYSTEM_ROLE,
        },
      ],
    },
    {
      key: 'content',
      label: '内容管理',
      icon: 'settings',
      permission: PERMISSION_MAP.CONTENT,
      children: [
        {
          key: 'content.portal',
          label: '首页',
          permission: PERMISSION_MAP.CONTENT_PORTAL,
          path: '',
        },
        {
          key: 'content.model',
          permission: PERMISSION_MAP.CONTENT_MODEL,
          label: '模型',
          path: '',
        },
        {
          key: 'content.tag',
          permission: PERMISSION_MAP.CONTENT_TAG,
          label: '标签管理',
          path: '',
        },
      ],
    },
  ],
};
