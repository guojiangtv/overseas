const path = require('path');

var pcBaseEntryDir = '../src/v2/pc/';
var mobileBaseEntryDir = '../src/v2/mobile/';

var baseEntryDir = process.env.PLATFORM == 'pc' ? pcBaseEntryDir : mobileBaseEntryDir;

const vue_source = process.env.NODE_ENV === 'production' ? path.resolve(__dirname, './../node_modules/vue/dist/vue.min.js') : path.resolve(__dirname, './../node_modules/vue/dist/vue.js');

module.exports = {
    // 模块别名的配置，为了使用方便，一般来说所有模块都是要配置一下别名的
    alias: {
        'vue': vue_source,
        'axios': path.resolve(__dirname, './../node_modules/axios/dist/axios.min.js'),
        'jquery':path.resolve(__dirname, './../node_modules/jquery/dist/jquery.min.js'),
        'webpack-zepto': path.resolve(__dirname, './../node_modules/webpack-zepto/index.js'),
        'layer': path.resolve(__dirname, baseEntryDir + 'js/lib/layer.js'),
        'common': path.resolve(__dirname, baseEntryDir + 'js/common/common.js'),
    },

    // 当require的模块找不到时，尝试添加这些后缀后进行寻找
    extensions: ['.js', '.css', '.less', '.vue', '.json'],
}
