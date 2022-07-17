'use strict';

const axios = require('axios');
const urlJoin = require('url-join');

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

module.exports = {
    getNpmInfo
};
