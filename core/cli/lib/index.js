'use strict';

module.exports = core;

const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const minimist = require('minimist');

// require 可以加载的文件类型是 .js/.json/.node 如果是其他后缀的文件，一律按照加载 js 文件的方式去解析，解析不了就报错
// .js -> module.exports exports
// .json -> JSON.parse
const log = require('@react-xx-cli/log');
const pkg = require('../package.json');
const constant = require('./const');

let args;

function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs();
        log.verbose('test', 'verbose...');
    } catch (error) {
        log.error(error.message);
    }
}

function checkPkgVersion() {
    log.info('cli', pkg.version);
}

function checkNodeVersion() {
    // 第一步检查当前版本
    const currentVersion = process.version;
    // 第二步检查最低版本
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(`react-xx-cli 需要安装 ${lowestVersion} 版本以上的 Node.js`);
    }
}

function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck();
}

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(`当前登录用户 ${colors.red(userHome)} 不存在`);
    }
}

function checkInputArgs() {
    args = minimist(process.argv.slice(2));
    checkArgs(args);
}

function checkArgs() {
    process.env.LOG_LEVEL = args.debug ? 'verbose' : 'info';
    log.level = process.env.LOG_LEVEL;
}