module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": 'babel-eslint',
        "sourceType": "module"
    },
    "plugins": [
      'vue'
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "off"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            2, "always"
        ]
    }
};
