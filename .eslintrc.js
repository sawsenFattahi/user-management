module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    alphabetize: {
      order: 'asc',
    },
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': ['error', { printWidth: 100 }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    'import/no-named-as-default': 0,
    'newline-before-return': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          'unknown',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'import/prefer-default-export': 0,
    'import/newline-after-import': [
      'error',
      {
        count: 1,
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'export',
      },
    ],
    'func-names': ['warn', 'as-needed'],
    indent: [
      'off',
      2,
      {
        SwitchCase: 1,
      },
    ],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
      },
    ],
    'no-console': 'error',
    'no-eval': 'error',
    'import/first': 'error',
    'import/extensions': 0,
    'comma-dangle': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'object-shorthand': ['error', 'always'],
    'consistent-return': 0,
    'no-use-before-define': 'error',
    'max-classes-per-file': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-useless-constructor': 0,
    'class-methods-use-this': 0,
    'import/no-anonymous-default-export': 0,
    'no-return-await': 0,
    'import/no-cycle': 0,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
