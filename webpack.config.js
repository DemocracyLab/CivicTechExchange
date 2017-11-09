const path = require('path');
const webpack = require('webpack');
// TODO: Figure out how to slim down the bundle .js
module.exports = {
    entry: "./common/components/mount-components.js",
    target: 'web',
    output: {
        path: path.resolve(__dirname, "./common/static/js"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    resolve: {
        aliasFields: ['browser']
    },
    node: {
        fs: "empty"
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'fs': 'empty'
        })
    ]
};