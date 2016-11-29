'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
//let BowerWebpackPlugin = require('bower-webpack-plugin');


let config = Object.assign({}, baseConfig, {
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,  // TODO: 127.0.0.1 is insufficent. We need a better adress. Maybe we can assume /etc/hosts is setup?
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  cache: true,
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        HOST_STATIC_PORT: JSON.stringify('6543'),  //process.env.HOST_STATIC_PORT || 
    }),
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel-loader',
  include: [].concat(
    config.additionalPaths,
    [
      path.join(__dirname, '/../src')
    ]
  ),
  query: {
    //presets: ['es2015-webpack',],
    presets: ['modern-browsers',],
    cacheDirectory: true,
  },
});

module.exports = config;
