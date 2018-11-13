#### yeoman工具使用方法
yeoman已集成到项目脚手架中
执行`yarn new`命令可启动yeoman，填写项目名称，项目标题，选择项目模板pc或mobile，即可自动生成相应的文件
#### 海外项目中mockjs使用方法
在前后端分离开发模式下，为了方便前端自己模拟数据，引入mockjs库，目前已在项目脚手架中安装。
已下载脚手架的同学可以直接更新package.js，yarn.lock 这两文件，然后执行npm install

#### mockjs使用方法

*  在mock文件夹中新建js文件，文件中需引入mockjs
*  编辑文件
```js
import Mock from 'mockjs';

Mock.mock('/worldcup/userrank', {
    'errno': 0,
    'msg': '',
    'data|10':[
        {
            'uid|+1'      : 123,
            'nickname' : 'ruby',
            'headPic'  : 'http://fpoimg.com/200x200',
            'rank'     : 1,     //用户排名
            'points|+1'   : 1000,   //用户积分
            'isFollow|0-1' : 1       //0:未关注 1:已关注
        }
    ]
});
```
Mock能自动拦截页面js中发出的ajax请求，并将模拟的数据作为请求结果返回
至于如何模拟自己想要的数据可参考[语法规范](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)

*  在项目js文件中引入自己模拟的数据文件
```js
//mock数据
import '../../../../../mock/worldcup.js';
```
当本地开发完要发测试时需在项目js文件中去掉自己模拟的数据文件
```js
//import '../../../../../mock/worldcup.js';
```

### 海外版前端自动化工具使用说明
此项目采用非覆盖式非双dll模式编译
git clone此项目后
yarn install安装必要的项目依赖和开发依赖包

#### svn获取项目文件

1. 当前目录下svn checkout https://10.0.0.15/svn/develop/website/cblive/web/html
2. 当前目录下svn checkout https://10.0.0.15/svn/develop/website/static_cblive/src
3. 当前目录下svn checkout https://10.0.0.15/svn/develop/website/static_cblive/dist
4. beta目录下svn checkout https://10.0.0.15/svn/develop/website/beta/cblive/web/html
5. beta目录下svn checkout https://10.0.0.15/svn/develop/website/beta/static_cblive
7. trunk目录下svn checkout https://10.0.0.15/svn/develop/website/trunk/cblive/web/html
8. trunk目录下svn checkout https://10.0.0.15/svn/develop/website/trunk/static_cblive


#### mobile项目开发

1. yarn watch 实时编译
2. yarn deploy 编译压缩添加版本号


#### PC项目开发

1. yarn pc_watch 实时编译
2. yarn pc_deploy 编译压缩添加版本号


#### 文件发布
* gulp copybeta 将文件列表中文件移动至相应的beta文件夹
* gulp copytrunk 将文件列表中文件移动至相应的trunk文件夹


建议使用sublime text3安装以下插件

1. EditorConfig统一控制编辑器中的缩进
2. sublimeLinter，sublimeLinter-eslint提示不符合规范的代码
