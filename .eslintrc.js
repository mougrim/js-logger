/* global module */
module.exports = {
    'env': {
        'browser': true,
        'es6': true,
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parserOptions': {
        'ecmaVersion': 10,
        'sourceType': 'module',
    },
    'rules': {
        'indent': [
            'warn',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        'quotes': [
            'error',
            'single',
            {'allowTemplateLiterals': true, 'avoidEscape': true},
        ],
        'semi': [
            'error',
            'always',
        ],
        'comma-dangle': ['error', 'always-multiline'],
    },
};
