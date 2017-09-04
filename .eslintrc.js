module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    'no-unused-vars': 'warn',
    'no-mixed-operators': 'off',
    'no-useless-escape': 'off',
    'space-before-function-paren': 'off',
    'no-undef': 'warn'
  },
  globals: {}
}
