const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const HappyPack = require('happypack');//它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。
const os = require('os');
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length});
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

//路径模式匹配模块glob
var glob = require('glob');
//是否是pc编译
var isPc = process.env.PLATFORM == 'pc' ? true : false;

//webpack配置
var eslintConfigDir = path.resolve(__dirname,'../.eslintrc.js');
var postcssConfigDir = path.resolve(__dirname,'../.postcssrc.js');
var resolveConfigDir = './resolve.config.js';


let entry = fs.readFileSync(path.resolve(__dirname,'../entry.txt'));
const entryArr = entry.toString().split('\n');
let jsArr=[],htmlArr=[];
entryArr.map(function(item){
    if(item.indexOf('/js/') !== -1){
        jsArr.push(item);
    }
    if(item.indexOf('/html/')!== -1 ){
        htmlArr.push(item);
    }
});

let baseEntryDir, entryDir, outputDir, basePageEntry, basePageOutput, dll_manifest_name,vendor_manifest_name, entries={};

if (isPc) {
    //pc版目录配置
    console.log('***********************PC编译*************************');
    baseEntryDir = path.resolve(__dirname,'./src/v2/pc/');
    entryDir = baseEntryDir + '**/*.js';
    outputDir = path.resolve(__dirname, './dist/v2/pc/');
    outputPublicDir = 'https://static.cblive.tv/dist/v2/pc/';
    basePageEntry = './html/src/pc/';
    basePageOutput = './html/dist/pc/';

    //clean folder
    cleanDir = [
        path.resolve(__dirname, 'dist/v2/pc'),
    ];

    dll_manifest_name = 'dll_pc_manifest';
    //入口js文件配置以及公共模块配置
    entries = getEntry(entryDir);
    entries.vendors = ['common'];
} else {
    //触屏版目录配置
    console.log('***********************触屏版编译*************************');
    baseEntryDir = path.resolve(__dirname,'../src/v2/mobile');
    entryDir = baseEntryDir + '/js/**/*.js';
    outputDir = path.resolve(__dirname, '../dist/v2/mobile');
    basePageEntry = path.resolve(__dirname, '../src/v2/mobile/html/');
    basePageOutput = path.resolve(__dirname,'../dist/v2/mobile/html/');
    dll_manifest_name = 'dll_manifest';
    vendor_manifest_name = 'vendor_manifest';
    //入口js文件配置以及公共模块配置
    entries = getEntry(jsArr);
}



module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    devtool: 'inline-source-map',
    entry: entries,
    output: {
        path: outputDir,
        filename: 'js/[name].[chunkhash:8].js'
    },
    devServer: {
        //设置服务器主文件夹，默认情况下，从项目的根目录提供文件
        contentBase: path.resolve(__dirname, '../dist/v2/mobile'),
        //自动开启默认浏览器
        open: true,
        //浏览器自动打开的文件夹
        openPage: 'html',
        //开启gzip压缩
        compress: true,
        //使用inlilne模式,会触发页面的动态重载
        inline: true,
        //当编译错误的时候，网页上显示错误信息
        overlay: {
            warnings: true,
            errors: true
        },
        //只在shell中展示错误信息
        //stats: 'errors-only',
        //设置域名，默认是localhost
        host: 'm.joylive.tv',
        port: 3000
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
            use: 'happypack/loader?id=ejs'
        }, {
            test: /\.js$/,
            enforce: 'pre',
            use: 'happypack/loader?id=js',
            include: path.resolve(__dirname, entryDir),
            exclude: [baseEntryDir + 'js/lib', baseEntryDir + 'js/component'],
        }, {
            test: /\.js$/,
            use: 'happypack/loader?id=babel',
            exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component']
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
            exclude: [baseEntryDir + 'css/lib']
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader']),
        }, {
            test: /\.(png|jpe?g|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 5120,
                name: function(p) {
                    var tem_path;
                    if(p.indexOf('/') != -1){
                        tem_path = p.split(/\/img\//)[1];
                    }else{
                        tem_path = p.split(/\\img\\/)[1];
                    }
                    tem_path = tem_path.replace(/\\/g,'/');

                    return '/img/'+tem_path + '?v=[hash:8]';
                }
            }
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            loader: 'file-loader'
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
        new HappyPack({
            id: 'ejs',
            threadPool: HappyThreadPool,
            loaders: ['ejs-loader']
        }),
        new HappyPack({
            id: 'js',
            threadPool: HappyThreadPool,
            loaders: [{
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            }]
        }),
        new HappyPack({
            id: 'babel',
            threadPool: HappyThreadPool,
            loaders: ['babel-loader?cacheDirectory=true']
        }),

        new webpack.DllReferencePlugin({
            // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
            // 指定manifest.json
            manifest: require('../manifest/' + dll_manifest_name + '.json'),
            // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
            name: 'dll_library',
        }),
        new webpack.DllReferencePlugin({
            // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
            // 指定manifest.json
            manifest: require('../manifest/' + vendor_manifest_name + '.json'),
            // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
            name: 'vendor_library',
        }),

        //将dll.js文件移到dist文件夹内
        new CopyWebpackPlugin([
            { from: baseEntryDir + '/js/lib', to: outputDir + '/js/lib' },
            { from: baseEntryDir + '/css/lib', to: outputDir + '/css/lib' },
        ]),

        new ExtractTextPlugin('css/[name].[contenthash:8].css'),

        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: require(eslintConfigDir),
                postcss: require(postcssConfigDir)
            },
        }),
        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            names: ['manifest'], // 公共模块的名称
            chunks: 'manifest', // chunks是需要提取的模块
            minChunks: Infinity //公共模块最小被引用的次数
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                getLatestFile('js/lib/dll.js'),
                getLatestFile('css/lib/dll.css'),
                getLatestFile('js/lib/vendor.js'),
                getLatestFile('css/lib/vendor.css')
            ],
            append: false
        }),
    ]
};

function getLatestFile(path){
    let new_path = path.replace(/\./g, '.**.');
    let latest_file = '';
    let latest_file_mtime = 0;

    glob.sync(baseEntryDir + '/' + new_path).forEach(function(file){
        let fileInfo = fs.statSync(file);
        let file_mtime = +new Date(fileInfo.mtime);

        latest_file = file_mtime > latest_file_mtime ? file : latest_file;
        latest_file_mtime = file_mtime > latest_file_mtime ? file_mtime : latest_file_mtime;
    });
    return latest_file.replace(/^.*\/(js\/|css\/)/ig, '$1');
}


/***** 生成组合后的html *****/
htmlArr.map(function(item){
    item = item.slice(21,-3);
    var conf = {
        // html模板文件输入路径
        template: path.resolve(__dirname, basePageEntry +'/'+ item +'.js'),
        // html文件输出路径
        filename: path.resolve(__dirname, basePageOutput +'/'+ item + '.html'),
        inject: true,
        cache: true, //只改动变动的文件
        minify: {
            removeComments: true,
            collapseWhitespace: false
        }
    };
    //根据chunks提取页面js,css和公共verdors
    if (item in entries) {
        conf.chunks = [item, 'manifest'];
    } else {
        conf.chunks = ['manifest'];
    }
    module.exports.plugins.push(new htmlWebpackPlugin(conf));
});

function getEntry(globPath) {
    globPath.forEach(function(item){
        let dirArr = item.split('/js/')[1].split('.js')[0];
        entries[dirArr] = item;
    });
    return entries;
}
