/** @type { import("eslint").Linter.Config } */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:svelte/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    eqeqeq: 'error',
    'no-restricted-globals': ['error', {
      name: 'console',
      message: 'Use `import { logger } from \'$lib/logger\'` instead.',
    }],
    'no-restricted-imports': ['error', {
      name: 'phosphor-svelte',
      message:
        'Instead of `import { Icon } from \'phosphor-svelte\'`, use `import Icon from \'phosphor-svelte/lib/Icon\'`.',
    }],
    '@typescript-eslint/consistent-type-imports': ['error', {
      prefer: 'type-imports',
      fixStyle: 'separate-type-imports',
    }],
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowIIFEs: true,
    }],
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/strict-boolean-expressions': ['error', {
      allowString: false,
      allowNumber: false,
      allowNullableObject: true,
      allowNullableBoolean: true,
      allowNullableString: false,
      allowNullableNumber: false,
      allowAny: false,
    }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      files: ['src/**/*.ts'],
      excludedFiles: ['src/server/service/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [{
              group: ['$lib/server/service/**/*'],
              importNamePattern: '^\\$',
              message: 'Do not use unauthorized service functions from non-services.',
            }],
          },
        ],
      },
    },
  ],
};
