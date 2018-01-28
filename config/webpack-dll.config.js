const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//const HashedChunkIdsPlugin = require('./config/hashedChunkIdsPlugin.js');

//webpack配置
const entries = ['vue', 'axios', 'flexible', 'webpack-zepto'];
const outputDir = path.resolve(__dirname, '../src/mobile/');
const resolveConfigDir = './resolve.config.js';
const dll_manifest_name = 'dll_manifest';


module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: {
        dll: entries
    },
    output: {
        path: outputDir,
        filename: 'js/lib/[name].js',
        library: '[name]_library',
        /*libraryTarget: 'umd'*/
    },
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            loader: 'eslint-loader',
            include: [entries],
            options: {
                fix: true
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [entries]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        //清除之前的dll.js
        new CleanWebpackPlugin([outputDir + '/js/lib'], {
            allowExternal: true
        }),
        //压缩JS代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        }),
        //稳定模块id
        //new HashedChunkIdsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DllPlugin({
            // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
            path: dll_manifest_name + '.json',
            //当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
            name: '[name]_library',
            // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
        })

    ]
};
