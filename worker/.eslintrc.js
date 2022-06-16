module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    worker: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist/**/*.js', 'dist/**/*.js.map'],
}
