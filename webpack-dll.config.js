const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HashedChunkIdsPlugin = require('./config/hashedChunkIdsPlugin.js');

//是否是生产环境
const prod = process.env.NODE_ENV === 'production' ? true : false;

//webpack配置
const resolveConfigDir = './config/resolve.config.js';

const baseEntryDir = './src/mobile/';
const outputDir = path.resolve(__dirname, './src/mobile/');
const outputPublicDir = 'http://static.joylive.tv/dist/mobile/';
const entries = ['vue', 'axios', 'flexible', 'webpack-zepto'];
const dll_manifest_name = 'dll_manifest';


module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: {
        dll: entries
    },
    output: {
        path: outputDir,
        publicPath: outputPublicDir,
        filename: 'js/lib/[name].js?v=[chunkhash:8]',
        library: '[name]_library',
        /*libraryTarget: 'umd'*/
    },
    module: {
        rules: [{
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                // include: path.resolve(__dirname, entryDir),
                // exclude: [baseEntryDir + 'js/lib', baseEntryDir + 'js/component'],
                options: {
                    fix: true
                }
            },{
                test: /\.js$/,
                loader: 'babel-loader',
                // exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['./src/mobile/js/lib']),
        //keep module.id stable when vender modules does not change
        new HashedChunkIdsPlugin(),
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


/***** 区分开发环境和生产环境 *****/

if (prod) {
    console.log('当前编译环境：production');
    module.exports.plugins = module.exports.plugins.concat([
        //压缩JS代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false, // 去掉注释内容
            }
        })
    ]);
} else {
    console.log('当前编译环境：dev');

    module.exports.devtool = 'cheap-module-source-map';

}
