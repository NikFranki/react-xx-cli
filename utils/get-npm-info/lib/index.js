'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
    if (!npmName) return null;
    const registryUrl = registry || getDefaultRegistry();
    const npmInfoUrl = urlJoin(registryUrl, npmName);
    return axios.get(npmInfoUrl).then((response) => {
        if (response.status === 200) {
            return response.data;
        }
        return null;
    }).catch((error) => {
        return Promise.reject(error);
    });
}

function getDefaultRegistry(isOriginal) {
    return isOriginal ? 'https ://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}

async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry);
    if (data) {
        return Object.keys(data.versions);
    }
    return [];
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersions(npmName, registry);
    const lastVersions = versions.filter(version => {
        return semver.satisfies(version, baseVersion);
    }).sort((a, b) => {
        return semver.gt(b, a);
    });
    if (lastVersions.length > 0) {
        return lastVersions[0];
    }
    return null;
}

module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersion
};
