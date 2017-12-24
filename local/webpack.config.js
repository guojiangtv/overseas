// 引入操作路径模块和webpack及所需的插件
const path = require("path");
const webpack = require('webpack');
//html模板插件 详见https://www.npmjs.com/package/html-webpack-plugin
const htmlWebpackPlugin = require('html-webpack-plugin');
//代码分离插件 详见https://www.npmjs.com/package/extract-text-webpack-plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// const CleanWebpackPlugin = require('clean-webpack-plugin');

// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// const CopyWebpackPlugin = require('copy-webpack-plugin');

// const HashedChunkIdsPlugin = require('./webpack-config/hashedChunkIdsPlugin.js');

//生产与开发环境配置
//var glob = require('glob');
//是否是生产环境
var prod = process.env.NODE_ENV === 'production' ? true : false; 

//项目目录配置
var entryDir = './src/mobile/v1/js/*.js';
var outputDir = './dist/mobile/v1/';
//var outputDir = path.resolve(__dirname, './static_guojiang_tv/mobile/v2');
var outPublicDir = 'http://static.cblive.tv/mobile/v1/';

// var basePageDir = 'html/mobile';
// var basePageEntry = './' + basePageDir + '/';
// var browserSyncBaseDir = './' + basePageDir + '/dist';
//clean folder
// var cleanFolder = [
// 	path.resolve(__dirname, './html/mobile/dist'),
// 	path.resolve(__dirname, './static_guojiang_tv/mobile/v2/css'),
// 	path.resolve(__dirname, './static_guojiang_tv/mobile/v2/js')
// ];

//var dll_manifest_name = 'dll_manifest';

//入口js文件配置以及公共模块配置
var entries = getEntry(entryDir);
entries.vendors = ['common', 'wxShare'];

console.log(entries);

module.exports = {
	/* 输入文件 */
	//resolve: require(resolveConfigDir),
	entry: entries,
	output: {
		path: outDir,
		publicPath: outPublicDir,
		filename: 'js/[name].js?v=[chunkhash:8]'
	},
	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					postcss: [require(postcssConfigDir)]
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
				loader: 'babel-loader',
				exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component']
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
				exclude: [baseEntryDir + 'css/lib']
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader']),
			},
			{
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
			},
			{
				test: /\.html$/,
				use: [{
					loader: 'html-loader',
					options: {
						minimize: true
					}
				}],
			}
		]
	},
	plugins: [
		new HashedChunkIdsPlugin(),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.DllReferencePlugin({
			context: __dirname, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
			manifest: require('./' + dll_manifest_name + '.json'), // 指定manifest.json
			name: 'dll_library', // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
		}),
		new BrowserSyncPlugin({
			host: 'm.tuho.tv',
			port: 3000,
			server: { baseDir: [browserSyncBaseDir] }
		}),

		new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),

		new webpack.LoaderOptionsPlugin({
			options: {
				eslint: require(eslintConfigDir),
				postcss: require(postcssConfigDir)
			},
		}),

		// 提取公共模块
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendors', 'manifest'], // 公共模块的名称
			//filename: 'js/vendors-[hash:6].js', // 公共模块的名称
			chunks: 'vendors', // chunks是需要提取的模块
			minChunks: Infinity //公共模块最小被引用的次数
		}),
		new CopyWebpackPlugin([
			{ from: baseEntryDir + 'js/lib', to: 'js/lib' },
		])
	]
};
