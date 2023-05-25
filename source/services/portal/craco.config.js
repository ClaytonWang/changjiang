const path = require('path');
const CracoLessPlugin = require('craco-less');

module.exports = {
  webpack: {
    alias: {
      '@': path.join(path.resolve(__dirname, './src')),
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#7B68EE', '@ant-prefix': 'brain' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: (devServerConfig) => {
    if (process.env.PROXY_ENV) {
      const target =
        process.env[`PROXY_${process.env.PROXY_ENV.toUpperCase()}`];
      if (target) {
        devServerConfig.compress = false;
        devServerConfig.proxy = {
          '/api': {
            target,
          },
        };
      }
    }
    return devServerConfig;
  },
};
