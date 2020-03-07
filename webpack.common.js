const path = require('path');
const webpack = require('webpack');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

module.exports = {
  entry: "./common/components/mount-components.js",
  target: 'web',
  output: {
    path: path.resolve(__dirname, "./common/static/js"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.svg$/, use: ['@svgr/webpack'] }
    ]
  },
  resolve: {
    aliasFields: ['browser']
  },
  node: {
      child_process: "empty",
      fs: "empty",
      tls: "empty"
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'fs': 'empty'
    }),
    new ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}
