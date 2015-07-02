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
