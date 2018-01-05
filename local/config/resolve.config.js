var path = require('path');

var pcBaseEntryDir = '../static_guojiang_tv/src/pc/v4/';
var mobileBaseEntryDir = '../src/mobile/v1/';

var baseEntryDir = process.env.PLATFORM == 'pc' ? pcBaseEntryDir : mobileBaseEntryDir;

// const vue_source = process.env.NODE_ENV === 'production' ? path.resolve(__dirname, baseEntryDir + 'js/lib/vue.min.js') : path.resolve(__dirname, baseEntryDir + 'js/lib/vue.js');
// const vue_source = path.resolve(__dirname, baseEntryDir + 'js/lib/vue.min.js');

module.exports = {
  // 模块别名的配置，为了使用方便，一般来说所有模块都是要配置一下别名的
	alias: {
        'vue': path.resolve(__dirname,'./../node_modules/vue/dist/vue.min.js'),
		'axios': path.resolve(__dirname,'./../node_modules/axios/dist/axios.min.js'),
        'layer': path.resolve(__dirname, baseEntryDir + 'js/lib/layer.js'),
		'flexible': path.resolve(__dirname, baseEntryDir + 'js/lib/flexible.js'),
		// 'rsa': path.resolve(__dirname, baseEntryDir + 'js/lib/rsa.js'),
		// 'common': path.resolve(__dirname, baseEntryDir + 'js/common/common.js'),
		// 'wxShare': path.resolve(__dirname, baseEntryDir + 'js/common/wxShare.js'),
		// 'user': path.resolve(__dirname, pcBaseEntryDir + 'js/common/user.js'),
		// 'component': path.resolve(__dirname, pcBaseEntryDir + 'js/common/gj.component.js')
	},

  // 当require的模块找不到时，尝试添加这些后缀后进行寻找
	extensions: ['.js', '.css', '.less', '.vue', '.json'],
}
