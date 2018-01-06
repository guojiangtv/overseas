var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var HashedChunkIdsPlugin = require('./config/hashedChunkIdsPlugin.js');

<<<<<<< HEAD
//生产与开发环境配置
//var glob = require('glob');
var isPc = process.env.PLATFORM == 'pc' ? true : false; //是否是pc编译
=======
//是否是生产环境
// var prod = process.env.NODE_ENV === 'production' ? true : false;
//是否是pc编译
var isPc = process.env.PLATFORM == 'pc' ? true : false;
>>>>>>> 1d36064c6fb512eddbf1790905c3e578e56dfc38

//webpack配置
//var postcssConfigDir = './config/postcss.config.js';
var resolveConfigDir = './config/resolve.config.js';

if (isPc) {
    //PC目录配置
    // var baseEntryDir = './static_guojiang_tv/src/pc/v4/';
    // var entryDir = baseEntryDir + '**/*.js';
    // var outDir = path.resolve(__dirname, './static_guojiang_tv/src/pc/v4');
    // var outPublicDir = 'http://static.guojiang.tv/pc/v4/';

    // var entries = ['vue','axios','layer','jquery'];

    // var dll_manifest_name = 'dll_manifest_pc';
} else {
    //触屏目录配置
    var baseEntryDir = './src/mobile/v1/';
    var entryDir = baseEntryDir + '**/*.js';
    var outDir = path.resolve(__dirname, './src/mobile/v1');
    var outPublicDir = 'http://static.cblive.tv/dist/mobile/v1/';
<<<<<<< HEAD
    var entries = ['vue', 'axios', 'layer', 'flexible', 'webpack-zepto'];
=======
    var entries = ['vue', 'axios', 'flexible'];
    // var entries = ['vue', 'axios', 'layer', 'flexible', 'webpack-zepto'];
>>>>>>> 1d36064c6fb512eddbf1790905c3e578e56dfc38
    var dll_manifest_name = 'dll_manifest';
}


module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: {
        dll: entries
    },
    output: {
        path: outDir,
        publicPath: outPublicDir,
        filename: 'js/lib/[name].js?v=[chunkhash:8]',
        library: '[name]_library',
        /*libraryTarget: 'umd'*/
    },
    module: {
        rules: [{
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                include: path.resolve(__dirname, entryDir),
<<<<<<< HEAD
                exclude: [baseEntryDir + 'js/lib', baseEntryDir + 'js/component'],
=======
                exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component'],
>>>>>>> 1d36064c6fb512eddbf1790905c3e578e56dfc38
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component']
<<<<<<< HEAD
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
                exclude: [baseEntryDir + 'css/lib']
            }
        ]
    },
    plugins: [
        new HashedChunkIdsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DllPlugin({
            path: dll_manifest_name + '.json', // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
            name: '[name]_library', // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
            context: __dirname, // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
        }),
        new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),

        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: require(postcssConfigDir)
            },
        }),
        //压缩css代码
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
=======
            }
            // ,{
            //     test: /\.css$/,
            //     use: ['style-loader', 'css-loader', 'postcss-loader'],
            //     exclude: [baseEntryDir + 'css/lib']
            // }
        ]
    },
    plugins: [
        // short-circuits all Vue.js warning code
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
>>>>>>> 1d36064c6fb512eddbf1790905c3e578e56dfc38
        }),
        //压缩JS代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
<<<<<<< HEAD
            //sourceMap: true,
            output: {
                comments: false, // 去掉注释内容
            }
        })
    ]
};

=======
            output: {
                comments: false, // 去掉注释内容
            },
        }),

        // new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),
        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         postcss: require(postcssConfigDir)
        //     },
        // }),
        // //压缩css代码
        // new OptimizeCssAssetsPlugin({
        //     assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
        //     cssProcessor: require('cssnano'),
        //     cssProcessorOptions: { discardComments: { removeAll: true } },
        //     canPrint: true
        // }),

        // keep module.id stable when vender modules does not change
        // new HashedChunkIdsPlugin(),
        // new webpack.HashedModuleIdsPlugin(),
        // new webpack.DllPlugin({
        //     path: dll_manifest_name + '.json', // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
        //     name: '[name]_library', // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
        //     context: __dirname, // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
        // }),


    ]
};
>>>>>>> 1d36064c6fb512eddbf1790905c3e578e56dfc38
