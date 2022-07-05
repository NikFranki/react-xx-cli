'use strict';

module.exports = utils;

function utils() {
    console.log('hello utils');
}

function add(a, b) {
    return a + b;
}

module.exports.add = add;