/* eslint-disable @typescript-eslint/no-var-requires */
const utils = require('../../utils');
module.exports = function (req, res) {
  utils.list(req, res, {
    data: [
      {
        id: 29,
        name: 'project',
        value: '项目',
      },
      {
        id: 21,
        name: 'project',
        value: '项目1',
      },
    ],
  });
};
