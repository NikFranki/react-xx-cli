'use strict';

const log = require('npmlog');

log.heading = 'react-xx-cli'; // 添加命令前缀
log.headingStyle = { fg: 'red', bg: 'black' };

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'; // 修改优先级

log.addLevel('success', 2000, { fg: 'green', bold: true }); // 自定义命令

module.exports = log;
