module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error', { endOfLine: 'lf' }],

    // Import order and sorting rules
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js built-in modules
          'external', // External libraries from node_modules
          'internal', // Internal project-specific modules
          ['parent', 'sibling', 'index'], // Parent/sibling/index relative imports
          'type', // TypeScript type imports
        ],
        pathGroups: [
          {
            pattern: '@nestjs/**',
            group: 'external', // Treat NestJS as an external library
            position: 'before',
          },
          {
            pattern: '@app/**',
            group: 'internal', // Example internal alias
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always', // Enforce newlines between import groups
        alphabetize: {
          order: 'asc', // Alphabetize imports within each group
          caseInsensitive: true,
        },
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      alias: {
        map: [['@app', './src/app']], // Example alias configuration
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
