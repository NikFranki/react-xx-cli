'use strict';

const semver = require('semver');
const colors = require('colors');

// require 可以加载的文件类型是 .js/.json/.node 如果是其他后缀的文件，一律按照加载 js 文件的方式去解析，解析不了就报错
// .js -> module.exports exports
// .json -> JSON.parse
const log = require('@react-xx-cli/log');
const pkg = require('../package.json');
const constant = require('./const');

module.exports = core;

function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
    } catch (error) {
        log.error(error.message);
    }
}

function checkPkgVersion(params) {
    log.info('cli', pkg.version);
}

function checkNodeVersion(params) {
    // 第一步检查当前版本
    const currentVersion = process.version;
    // 第二步检查最低版本
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(`react-xx-cli 需要安装 ${lowestVersion} 版本以上的 Node.js`);
    }
}

function checkRoot(params) {
    const rootCheck = require('root-check');
    rootCheck();
}