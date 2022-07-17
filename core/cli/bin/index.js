#!/usr/bin/env node

const importLocal = require('import-local');

if (importLocal(__filename)) {
    require('npmlog').info('cli', '正在使用 react-xx-cli 本地文件')
} else {
    require('../lib')(process.argv.slice(2));
}