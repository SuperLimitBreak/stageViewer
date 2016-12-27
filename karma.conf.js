'use strict';

// Set node environment to testing
process.env.NODE_ENV = 'test';

const {buildKarmaCfg} = require('../displayTrigger/display/karma.conf.base.js');

module.exports = buildKarmaCfg(
    require('./webpack.config.js'),
    {}
);
