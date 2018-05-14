### 海外版前端自动化工具使用说明
此项目采用非覆盖式非双dll模式编译
git clone此项目后
yarn install安装必要的项目依赖和开发依赖包

#### svn获取项目文件

1. 当前目录下svn checkout https://10.0.0.15/svn/develop/website/cblive/web/html
2. src目录下svn checkout https://10.0.0.15/svn/develop/website/static_cblive/src/v2
3. dist目录下svn checkout https://10.0.0.15/svn/develop/website/static_cblive/dist/v2
4. beta/cblive/web目录下svn checkout https://10.0.0.15/svn/develop/website/beta/cblive/web/html
5. beta/static_cblive/src目录下svn checkout https://10.0.0.15/svn/develop/website/static_cblive/src/v2
6. beta/static_cblive/dist目录下svn checkout https://10.0.0.15/svn/develop/website/static_cblive/dist/v2
7. trunk/cblive/web/html目录下svn checkout https://10.0.0.15/svn/develop/website/trunk/cblive/web/html
8. trunk/static_cblive/src目录下svn checkout https://10.0.0.15/svn/develop/website/trunk/static_cblive/src/v2
9. trunk/static_cblive/dist目录下svn checkout https://10.0.0.15/svn/develop/website/trunk/static_cblive/dist/v2


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
