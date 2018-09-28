const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// TODO: Figure out how to slim down the bundle .js
module.exports = {
    entry: "./common/components/mount-components.js",
    target: 'web',
    output: {
        path: path.resolve(__dirname, "./common/static/js"),
        filename: "bundle.js"
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                  presets: ['react', 'babel-preset-react-hmre']
                },
            }
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
        }),
        new HtmlWebpackPlugin({
            title: 'Dev DL',
            template: 'civictechprojects/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
