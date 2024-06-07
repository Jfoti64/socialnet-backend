// eslint.config.js
import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2021,
      globals: {
        ...globals.node,
        process: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
];
