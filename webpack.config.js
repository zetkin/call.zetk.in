var path = require('path');
var webpack = require('webpack');

var appId = process.env.ZETKIN_APP_ID || 'a5';

module.exports = {
    entry: [
        path.join(__dirname, 'dist/app/client/main.js')
    ],
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': process.env.NODE_ENV,
            'process.env.ZETKIN_DOMAIN': '"dev.zetkin.org"',
            'process.env.ZETKIN_APP_ID': '"' + appId + '"',
        }),
    ],
    output: {
        path: path.join(__dirname, 'dist/static'),
        publicPath: 'http://call.dev.zetkin.org',
        filename: '[name].js'
    }
};
