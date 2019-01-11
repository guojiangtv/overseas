const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const fs = require('fs');
const os = require('os');
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length});
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HashedChunkIdsPlugin = require('./config/hashedChunkIdsPlugin.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');


//路径模式匹配模块glob
let glob = require('glob');
//是否是生产环境
let prod = process.env.NODE_ENV === 'production' ? true : false;
//是否是pc编译
let isPc = process.env.PLATFORM == 'pc' ? true : false;

//webpack配置
let eslintConfigDir = './.eslintrc.js' ;
let postcssConfigDir = './config/postcss.config.js';
let resolveConfigDir = './config/resolve.config.js';


//忽略不必要编译的文件
// var entryIgnore = require('./entryignore.json');
let baseEntryDir,entryDir,outputDir,outputPublicDir,basePageEntry,basePageOutput,cleanDir,dll_manifest_name,entries={},browserSyncBaseDir;

if(isPc){
    //pc版目录配置
    console.log('***********************PC编译*************************');
    baseEntryDir = './src/v2/pc/';
    entryDir = baseEntryDir + '**/*.js';
    outputDir = path.resolve(__dirname, './dist/v2/pc/');
    outputPublicDir = 'https://static.cblive.tv/dist/v2/pc/';
    basePageEntry = './html/src/pc/';
    basePageOutput = './html/dist/pc/';
    browserSyncBaseDir = './html/dist/pc';
    //clean folder
    cleanDir = [
        path.resolve(__dirname, 'dist/v2/pc'),
    ];

    dll_manifest_name = 'dll_pc_manifest';
    //入口js文件配置以及公共模块配置
    entries = getEntry(entryDir);
    entries.vendors = ['common'];
}else{
    //触屏版目录配置
    console.log('***********************触屏版编译*************************');
    baseEntryDir = './src/v2/mobile/js/';
    entryDir = baseEntryDir + '**/*.*';
    outputDir = path.resolve(__dirname, './dist/v2/mobile/');
    outputPublicDir = '//static.joylive.tv/dist/v2/mobile/';
    basePageEntry = './html/src/mobile/';
    basePageOutput = './html/dist/mobile/';
    browserSyncBaseDir = './html/dist/mobile/';

    //clean folder
    cleanDir = [
        path.resolve(__dirname, 'dist/v2/mobile')
    ];
    dll_manifest_name = 'dll_manifest';
    //入口js文件配置以及公共模块配置
    entries = getEntry(entryDir);
    entries.vendors = ['common'];
}


console.log(entries);

module.exports = {
    cache: true,
    resolve: require(resolveConfigDir),
    entry: entries,
    output: {
        path: outputDir,
        publicPath: outputPublicDir,
        filename: "js/[name].js?v=[chunkhash:8]"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                enforce: "pre",
                loader: "tslint-loader",
                options: { fix: true }
            },
            {
                test: /\.ts?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    postcss: [require(postcssConfigDir)]
                }
            },
            {
                test: /\.ejs$/,
                use: "happypack/loader?id=ejs"
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: "happypack/loader?id=js",
                include: path.resolve(__dirname, entryDir),
                exclude: [baseEntryDir + "lib", baseEntryDir + "component"]
            },
            {
                test: /\.js$/,
                use: "happypack/loader?id=babel",
                exclude: [
                    "node_modules",
                    baseEntryDir + "lib",
                    baseEntryDir + "component"
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"]
                //exclude: [baseEntryDir + 'css/lib']
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract([
                    "css-loader",
                    "postcss-loader",
                    "less-loader"
                ])
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader",
                options: {
                    limit: 5120,
                    name: function(p) {
                        let tem_path = p.split(/\\img\\/)[1];
                        tem_path = tem_path.replace(/\\/g, "/");
                        return "img/" + tem_path + "?v=[hash:8]";
                    }
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: "file-loader"
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: "ejs",
            threadPool: HappyThreadPool,
            loaders: ["ejs-loader"]
        }),
        new HappyPack({
            id: "js",
            threadPool: HappyThreadPool,
            loaders: [
                {
                    loader: "eslint-loader",
                    options: {
                        fix: true
                    }
                }
            ]
        }),
        new HappyPack({
            id: "babel",
            threadPool: HappyThreadPool,
            loaders: ["babel-loader?cacheDirectory=true"]
        }),
        //浏览器同步刷新
        new BrowserSyncPlugin({
            port: 3000,
            server: { baseDir: [browserSyncBaseDir] }
        }),

        //将dll.js文件移到dist文件夹内
        new CopyWebpackPlugin([
            { from: baseEntryDir + "/lib", to: outputDir + "/js/lib" }
        ]),
        //稳定chunkID
        new HashedChunkIdsPlugin(),
        //稳定moduleID
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DllReferencePlugin({
            // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
            // 指定manifest.json
            manifest: require("./" + dll_manifest_name + ".json"),
            // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
            name: "dll_library"
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ["js/manifest.js"],
            append: false
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ["js/lib/dll.js"],
            append: false
        }),
        new ExtractTextPlugin("css/[name].css?v=[contenthash:8]"),
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: require(eslintConfigDir),
                postcss: require(postcssConfigDir)
            }
        }),

        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendors", "manifest"], // 公共模块的名称
            chunks: "vendors", // chunks是需要提取的模块
            minChunks: Infinity //公共模块最小被引用的次数
        })
    ]
};

/***** 生成组合后的html *****/
var pages = getEntry(basePageEntry + '**/*.ejs');
for (var pathname in pages) {
    var conf = {
        // html模板文件输入路径
        template: path.resolve(__dirname, basePageEntry + pathname + '.js'),
        // html文件输出路径
        filename: path.resolve(__dirname, basePageOutput + pathname + '.html'),
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

    module.exports.plugins.push(new htmlWebpackPlugin(conf));
}


/**
 * [获取文件列表(仅支持js和ejs文件)：输出正确的js和html路径]
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
function getEntry(globPath) {
    var entries = {};
    glob.sync(globPath).forEach(function(entry) {

        //排出layouts内的公共文件
        if (entry.indexOf('layouts') == -1 && entry.indexOf('lib') == -1 && entry.indexOf('components') == -1 && entry.indexOf('vue') === -1) {
            //判断是js文件还是html模板文件
            let isEjsFile = entry.indexOf('.ejs') !== -1;
            let dirArr = isEjsFile ?
                entry.split(basePageEntry)[1].split('.ejs')[0]:
                entry.split('/js/')[1].split('.')[0] ;

            // basename = dirArr.join('/');

            // if (entryIgnore.indexOf(basename) == -1) {
            entries[dirArr] = entry;
            // }

        }
    });

    return entries;
}

/***** 区分开发环境和生产环境 *****/

if (prod) {
    console.log('当前编译环境：production');
    module.exports.plugins = module.exports.plugins.concat([
        new CleanWebpackPlugin(cleanDir),
        //压缩css代码
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                // 避免 cssnano 重新计算 z-index
                safe: true,
                autoprefixer: false
            },
            canPrint: true
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
    ]);
} else {
    console.log('当前编译环境：dev');
    module.exports.devtool = 'inline-source-map';
}
