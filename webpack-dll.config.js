const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽离css
const HashedChunkIdsPlugin = require('./config/hashedChunkIdsPlugin.js');

//是否是生产环境
const prod = process.env.NODE_ENV === 'production' ? true : false;
const isPc = process.env.PLATFORM == 'pc' ? true : false; //是否是pc编译

//webpack配置
const eslintConfigDir = './.eslintrc.js';
const postcssConfigDir = './config/postcss.config.js';
const resolveConfigDir = './config/resolve.config.js';
let baseEntryDir,outputDir,outputPublicDir,entries,dll_manifest_name,entryDir;
if(isPc){
    //PC目录配置
    baseEntryDir = './src/v2/pc/';
    entryDir = baseEntryDir + '**/*.js';
    outputDir = path.resolve(__dirname, './src/v2/pc/');
    outputPublicDir = 'https://static.cblive.tv/dist/pc/';
    entries = ['vue','axios','layer','jquery'];
    dll_manifest_name = 'dll_pc_manifest';
}else{
    baseEntryDir = './src/v2/mobile/';
    entryDir = baseEntryDir + '**/*.js';
    outputDir = path.resolve(__dirname, './src/v2/mobile/');
    outputPublicDir = 'http://static.cblive.tv/dist/mobile/';
    entries = ['vue', 'axios', 'layer', 'webpack-zepto'];
    dll_manifest_name = 'dll_manifest';
}


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
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    postcss: [require( postcssConfigDir )]
                }
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-loader'
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                include: path.resolve(__dirname, entryDir),
                exclude: [baseEntryDir + 'js/lib', baseEntryDir + 'js/component'],
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory=true',
                exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
                exclude: [baseEntryDir + 'css/lib']
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract(['css-loader','postcss-loader','less-loader']),
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 512,
                    name: function(p){
                        let tem_path = p.split(/\\img\\/)[1];
                        tem_path = tem_path.replace(/\\/g,'/');

                        return 'img/'+tem_path + '?v=[hash:8]';
                    }
                }
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }],
            }
        ]
    },
    plugins: [
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
        }),
        new ExtractTextPlugin('css/[name].[contenthash:8].css'),
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: require(eslintConfigDir),
                postcss: require(postcssConfigDir)
            },
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
