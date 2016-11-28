'use strict';

let webpack = require('webpack');

let path = require('path');
let srcPath = path.join(__dirname, '/../src/');

let baseConfig = require('./base');

// Add needed plugins here
//let BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
  devtool: 'eval',
  module: {
    preLoaders: [
      //{
      //  test: /\.(js|jsx)$/,
        //loader: 'isparta-instrumenter-loader',
      //  include: [
      //    path.join(__dirname, '/../src')
      //  ]
      //}
    ],
    loaders: [
      {
        test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [].concat(
          //baseConfig.additionalPaths,
          [
            path.join(__dirname, '/../src'),
            path.join(__dirname, '/../test')
          ]
        )
      }
    ]
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    alias: {
      src: srcPath,
      //helpers: path.join(__dirname, '/../test/helpers'),
      config: srcPath + 'config/' + process.env.WEBPACK_ENV
    }
  },
  plugins: [
    new webpack.DefinePlugin({
        HOST_STATIC_PORT: JSON.stringify('0000'),
    }),
    //new BowerWebpackPlugin({
    //  searchResolveModulesDirectories: false
    //})
  ]
};
