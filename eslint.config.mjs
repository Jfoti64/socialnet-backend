import { ESLint } from 'eslint';

export default [
  {
    env: {
      commonjs: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:node/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'airbnb-base',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      'no-underscore-dangle': 'off',
      'import/no-unresolved': 'off',
    },
  },
];
