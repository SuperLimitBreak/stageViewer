'use strict';
const {buildWebpackCfg} = require('../displayTrigger/display/webpack.config.base.js');
const webpackCfg = buildWebpackCfg(__dirname);
webpackCfg.entry.index = 'index.jsx';

const webpack = require('webpack');
webpackCfg.plugins.push(
    new webpack.ProvidePlugin({
        "THREE": "three",
    })
);

module.exports = webpackCfg;
