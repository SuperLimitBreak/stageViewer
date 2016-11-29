'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [path.join(__dirname, '/../ext'), ];

module.exports = {
  additionalPaths: additionalPaths,
  //port: defaultSettings.port,
  debug: true,
  devtool: 'eval',
  stats: {
    colors: true,
    reasons: true,
  },
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      ext: path.join(__dirname, '/../ext'),
      src: `${defaultSettings.srcPath}`,
      config: `${defaultSettings.srcPath}/config/${process.env.WEBPACK_ENV}`
    }
  },
  module: {}
};
