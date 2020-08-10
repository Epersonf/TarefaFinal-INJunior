module.exports = {
  env: {
    node: true,
    mocha: true
  },
  extends: 'standard',
  plugins: ['prettier'],

  rules: {
    semi: [2, 'always'],
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ]
  }
};
