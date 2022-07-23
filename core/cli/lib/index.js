'use strict';

module.exports = core;

const path = require('path');
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

async function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs();
        checkEnv();
        await checkGrobalUpdate();
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

function checkEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if (pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath
        });
    }
    createDefaultConfig();
    // log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    };
    if (process.env.CLI_HOME) {
        cliConfig['CLI_HOME'] = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig['CLI_HOME'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    }
    process.env.CLI_HOME_PATH = cliConfig['CLI_HOME'];
}

async function checkGrobalUpdate() {
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    const { getNpmSemverVersion } = require('@react-xx-cli/get-npm-info');
    const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
    if (lastVersion && semver.gte(lastVersion, currentVersion)) {
        log.warn(`更新提示：${colors.yellow(`请手动更新 ${npmName}，当前版本 ${currentVersion} 最新版本 ${lastVersion} 
                更新命令 npm -g i ${npmName}`)}`);
    }
}