'use strict';
const path = require('path');
const {buildWebpackCfg} = require('../displayTrigger/display/webpack.config.base.js');
const webpackCfg = buildWebpackCfg(__dirname);

const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
webpackCfg.plugins.push(
    new webpack.ProvidePlugin(
        { THREE: "three" }
    ),
    new CopyPlugin([
        {
            from: path.join(__dirname, 'node_modules/displayTrigger/src/assets'),
            to: 'assets',
        },
    ]),
);

webpackCfg.entry.index = 'index.jsx';

module.exports = webpackCfg;
