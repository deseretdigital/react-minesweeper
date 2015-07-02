var fs = require('fs');
var fileExists = fs.existsSync;
var path = require('path');
var webpack = require('webpack');
var React = require('react');

module.exports = {

  devtool: 'eval',

  entry: './src/index.js',

  output: {
    path: './web/assets',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: 'assets'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }

};
