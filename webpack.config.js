const path = require('path');
const webpack = require('webpack');
// TODO: Investigate pulling the SASS compile in here instead of as an npm script
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
        child_process: "empty",
        fs: "empty",
        tls: "empty"
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'fs': 'empty'
        })
    ]
};
