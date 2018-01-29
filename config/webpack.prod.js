const path = require("path");
const webpack = require('webpack');
const glob = require('glob');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

//const HashedChunkIdsPlugin = require('./config/hashedChunkIdsPlugin.js');

console.log('当前编译环境：production');
//webpack配置
var eslintConfigDir = '../.eslintrc.js';
var postcssConfigDir = '../.postcssrc.js';
var resolveConfigDir = './resolve.config.js';

//忽略不必要编译的文件
// var entryIgnore = require('./entryignore.json');


//目录配置
var entryDir = path.resolve(__dirname,'../src/mobile/');
var outputDir = path.resolve(__dirname, '../dist/mobile/');
var dll_manifest_name = 'dll_manifest';

//建立express服务器
const express = require('express');
const app = express();
//指定静态文件的位置
app.use('/', express.static(path.resolve(__dirname, '../dist/mobile')));
//监听端口号
app.listen(80,'m.joylive.tv');


//入口js文件配置以及公共模块配置
var entries = getEntry(entryDir + '/js/**/*.js');
entries.vendors = ['common'];

console.log(entries);

module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: entries,
    output: {
        path: outputDir,
        publicPath: 'http://static.joylive.tv/dist/mobile/',
        filename: 'js/[name].js?v=[chunkhash:8]'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                postcss: [require(postcssConfigDir)]
            }
        }, {
            test: /\.ejs$/,
            loader: 'ejs-loader'
        }, {
            test: /\.js$/,
            enforce: 'pre',
            loader: 'eslint-loader',
            include:[entryDir + '\\js\\activity\\'],
            options: {
                fix: true
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include:[entryDir + '\\js\\'],
            options: {
                presets: ['env']
            }
        },{
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
            //exclude: [baseEntryDir + 'css/lib']
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader']),
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 5120,
                name: function(p) {
                    let tem_path = p.split(/\\img\\/)[1];
                    tem_path = tem_path.replace(/\\/g, '/');
                    return 'img/' + tem_path + '?v=[hash:8]';
                }
            }
        }, {
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }],
        }]
    },
    plugins: [
        new CleanWebpackPlugin(outputDir, {
            allowExternal: true
        }),

        //new HashedChunkIdsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DllReferencePlugin({
            // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
            // 指定manifest.json
            manifest: require('../' + dll_manifest_name + '.json'),
            // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
            name: 'dll_library',
        }),

        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: require(eslintConfigDir),
                postcss: require(postcssConfigDir)
            },
        }),

        new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),

        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors', 'manifest'], // 公共模块的名称
            //filename: 'js/vendors-[hash:6].js', // 公共模块的名称
            chunks: 'vendors', // chunks是需要提取的模块
            minChunks: Infinity //公共模块最小被引用的次数
        }),
        //压缩css代码
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                // 避免 cssnano 重新计算 z-index
                safe: true
            },
            canPrint: true
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
        //将dll.js文件移到dist文件夹内
        new CopyWebpackPlugin([
            { from: entryDir + '/js/lib', to: outputDir + '/js/lib' },
        ]),
    ]
};

/***** 生成组合后的html *****/
var pages = getEntry(entryDir + '/html/**/*.ejs');
for (var pathname in pages) {
    var conf = {
        // html模板文件输入路径
        template: entryDir + '/html/' + pathname + '.js',
        // html文件输出路径
        filename: outputDir + '/html/' + pathname + '.html',
        inject: true,
        cache: true, //只改动变动的文件
        minify: {
            removeComments: true,
            collapseWhitespace: false
        }
    };
    //根据chunks提取页面js,css和公共verdors
    if (pathname in module.exports.entry) {
        conf.chunks = [pathname, 'vendors'];
    } else {
        conf.chunks = ['vendors'];
    }

    module.exports.plugins.push(new htmlWebpackPlugin(conf), new HtmlWebpackIncludeAssetsPlugin({
        assets: ['js/lib/dll.js', 'js/manifest.js'],
        append: false
    }));
}


/**
 * [获取文件列表(仅支持js和ejs文件)：输出正确的js和html路径]
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
function getEntry(globPath) {
    var entries = {};
    glob.sync(globPath).forEach(function(entry) {
        //排出layouts,lib,components文件夹中内容
        if (entry.indexOf('layouts') == -1 && entry.indexOf('lib') == -1 && entry.indexOf('components') == -1) {
            //判断是js文件还是html模板文件
            let isJsFile = entry.indexOf('.js') !== -1;
            let entryItem = isJsFile ?
                entry.split('/js/')[1].split('.js')[0] :
                entry.split('/html/')[1].split('.ejs')[0];

            //if (entryIgnore.indexOf(entryItem) == -1) {
                entries[entryItem] = entry;
            //}

        }
    });

    return entries;
}
