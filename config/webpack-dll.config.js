const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

//是否是pc编译
const isPc = process.env.PLATFORM == 'pc' ? true : false;

//webpack配置
const postcssConfigDir = '../.postcssrc.js';
const resolveConfigDir = './resolve.config.js';
let outputDir, outputPublicDir, entries, manifest_name;

if (isPc) {
    //PC目录配置
    outputDir = path.resolve(__dirname, '../src/v2/pc/');
    outputPublicDir = 'https://static.cblive.tv/dist/pc/';
    entries = ['vue', 'axios', 'layer', 'jquery'];
    manifest_name = 'dll_pc_manifest';
} else {
    outputDir = path.resolve(__dirname, '../src/v2/mobile/');
    outputPublicDir = 'http://static.cblive.tv/dist/mobile/';
    entries = ['vue', 'axios', 'layer', 'webpack-zepto'];
    manifest_name = 'dll_manifest';
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
        filename: 'js/lib/[name].[chunkhash:8].js',
        library: '[name]_library',
        /*libraryTarget: 'umd'*/
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory=true',
                include:entries
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader']),
            }
        ]
    },
    plugins: [
        //定义生产环境
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        //生成dll
        new webpack.DllPlugin({
            // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
            path: './manifest/'+manifest_name + '.json',
            //当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
            name: '[name]_library',
            // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
        }),

        new ExtractTextPlugin('css/lib/[name].[contenthash:8].css'),

        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: require(postcssConfigDir)
            },
        }),
        //压缩JS代码
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                ie8: false,
                output: {
                    comments: false,
                    beautify: false,
                },
                compress: true,
                warnings: false
            }
        }),
        //压缩css
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {removeAll: true },
                // 避免 cssnano 重新计算 z-index
                safe: true,
                //cssnano通过移除注释、空白、重复规则、过时的浏览器前缀以及做出其他的优化来工作，一般能减少至少 50% 的大小
                //cssnano 集成了autoprefixer的功能。会使用到autoprefixer进行无关前缀的清理。默认不兼容ios8，会去掉部分webkit前缀，比如flex
                //所以这里选择关闭，使用postcss的autoprefixer功能
                autoprefixer: false
            },
            canPrint: true
        }),

    ]
};
