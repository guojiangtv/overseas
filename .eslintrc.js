module.exports = {
    root: true,
    env: {
        //浏览器环境中的全局变量
        browser: true,
        //CommonJS 全局变量和 CommonJS 作用域
        commonjs: true,
        // 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）
        es6: true
    },
    //定义全局变量
    globals: {
        window:true,//用于定义方法便于app调用
        _czc: true, //用于统计
        recharge:true,//安卓js对象
        gBridge:true//ios android js对象
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        //https://standardjs.com/rules-zhcn.html#javascript-standard-style
        "standard"
    ],
    parserOptions: {
        parser: "babel-eslint",
        sourceType: "module"
    },
    //此项是用来提供插件的，插件名称省略了eslint-plugin-
    plugins: ["vue"],
    rules: {
        "import/no-unresolved": ["error", { commonjs: true, amd: true }],
        "import/namespace": "error",
        "import/default": "error",
        "import/export": "error",
        "indent": ["error", 4],
        //取消强制使用一致的换行风格
        "linebreak-style": "off",
        "no-console": "off",
        //函数需要jsDoc注释 ctrl+alt+D
        // "require-jsdoc": [
        //     "error",
        //     {
        //         require: {
        //             FunctionDeclaration: true,
        //             MethodDefinition: true,
        //             ClassDeclaration: false,
        //             ArrowFunctionExpression: false,
        //             FunctionExpression: false
        //         }
        //     }
        // ],
        "strict": "error",
        //new实例可以不赋值给变量，new Vue()
        "no-new": "off",
        // 是否禁止无用的表达式
        "no-unused-expressions": "off",
        // 取消禁止扩展原生对象
        "no-extend-native": "off",
        //不限制每行的属性数量
        "vue/max-attributes-per-line": "off"
    },
    settings: {
        /**
         * 这里传入webpack并不是import插件能识别webpack，而且通过npm安装了「eslint-import-resolver-webpack」，
         * 「import」插件通过「eslint-import-resolver-」+「webpack」找到该插件并使用，就能解析webpack配置项。使用里面的参数。
         * 主要是使用以下这些参数，共享给import规则，让其正确识别import路径
         * extensions: ['.js', '.vue', '.json'],
         * alias: {
         * 'vue$': 'vue/dist/vue.esm.js',
         * '@': resolve('src'),
         * 'static': resolve('static')
         * }
         */
        "import/resolver": "webpack"
    }
};
