const path = require('path');
const webpack = require('webpack');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleTracker = require("webpack-bundle-tracker")

module.exports = {
  entry: ["./common/components/mount-components.js", "./civictechprojects/static/css/styles.scss"],
  target: 'web',
  output: {
    path: path.resolve(__dirname, "./common/static"),
    filename: "js/[name].bundle.js",
  },
  module: {
    rules: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.svg$/, use: ['@svgr/webpack'] },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 2
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        }
    ]
  },
  resolve:{
    aliasFields: ['browser'],
    extensions: ['.*', '.js', '.jsx'],
    fallback: {
      fs: false,
      tls: false
    }
  },
  node: false,
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'fs': 'empty'
    }),
    new ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].styles.css',
    }),
    new BundleTracker({ filename: 'webpack-stats.json' }),
  ],
  optimization: {
    //runtimeChunk: 'single',
    splitChunks: { 
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}
