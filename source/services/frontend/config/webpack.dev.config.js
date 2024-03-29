/*
 * @Author: junshi clayton.wang@digitalbrain.cn
 * @Date: 2023-02-02 15:30:25
 * @LastEditors: junshi clayton.wang@digitalbrain.cn
 * @LastEditTime: 2023-02-21 12:40:56
 * @FilePath: /huanghe/source/services/frontend/config/webpack.dev.config.js
 * @Description:
 */

/* eslint-disable */
const webpack = require('webpack');
const path = require("path");
const { merge } = require('webpack-merge');
const base = require('./webpack.base.config.js');
const { apiPrefix } = require('../src/common/utils/config');

const mock = process.env.MOCK === 'local';

const proxy = {
  // target: 'http://124.71.133.7/',
  target: 'http://121.36.41.231:30767/',
  changeOrigin: true,
  headers: {
    Host: '121.36.41.231',
  },
};

const mockProxy = {
  target: 'http://localhost:3721/',
  changeOrigin: true,
  headers: {
    Host: 'localhost:3721',
  },
};

module.exports = merge(base, {
  mode: 'development',
  devtool: "eval-cheap-module-source-map",
  optimization: {
    chunkIds: 'size',
  },

  devServer: {
    static: {
      directory: path.resolve("./","public/"),
    },
    hot: true,
    port: 9000,
    open: true,
    compress: false,
    historyApiFallback: true,
    proxy: {
      logLevel: 'debug',
      [apiPrefix]: mock ? mockProxy : proxy,
    },
  },
});
