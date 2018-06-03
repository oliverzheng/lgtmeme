// @flow
// @format
/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const BabelPluginTransformFlowStripTypes = require('babel-plugin-transform-flow-strip-types');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FlowtypePlugin = require('flowtype-loader/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map', // Chrome CSP doesn't allow `eval()`
  entry: {
    background: './src/chrome-extension/background.js',
    inline: './src/chrome-extension/inline.js',
    popup: './src/chrome-extension/popup.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [BabelPluginTransformFlowStripTypes],
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'flowtype-loader',
        enforce: 'pre',
        exclude: /node_modules/,
      },
      {
        test: /\.(json)$/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist/chrome-extension']),
    new FlowtypePlugin(),
    new HtmlWebpackPlugin({
      title: 'LGTMeme for Chrome',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new CopyWebpackPlugin([{from: './src/chrome-extension/manifest.json'}]),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist', 'chrome-extension'),
  },
};
