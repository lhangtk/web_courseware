module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  extends: [
    'dxk',
  ],
  plugins: [],
  // 在此处添加自定义规则
  rules: {}
}