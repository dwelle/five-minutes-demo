module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['react-hooks'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Not needed.
    '@typescript-eslint/explicit-function-return-type': 'off',
    // Buggy.
    '@typescript-eslint/no-empty-interface': 'off',
    // Any as placeholder is OK.
    '@typescript-eslint/no-explicit-any': 'off',
    // No console in production.
    'no-console': 'error',
    // TODO: Retest.
    'react/no-children-prop': 'off',
    // Because it's important.
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
};
