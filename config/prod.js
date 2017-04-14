const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  context: resolve(__dirname, '../src'),

  entry: [
    './index.js'
  ],
  output: {
    filename: 'bundle.js',

    path: resolve(__dirname, '../dist'),

    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [ 'babel-loader', ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader?modules', 'postcss-loader', ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
            screw_ie8: true,
            keep_fnames: true
        },
        compress: {
            screw_ie8: true
        },
        comments: false
    })
  ],
};