module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'plugin:nuxt/recommended',
    'plugin:import/recommended'
  ],
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      env: {
        node: true
      },
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue', 'check-file', 'import'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    indent: ['error', 2],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 0,
        switchCase: 0
      }
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'components/**': 'PASCAL_CASE'
      }
    ],
    'check-file/filename-naming-convention': [
      'error',
      {
        'components/**/*.vue': 'PASCAL_CASE',
        'components/**/*.{js,ts,tsx}': 'CAMEL_CASE',
        'assets/*': 'KEBAB_CASE'
      },
      {
        ignoreMiddleExtensions: true
      }
    ]
  }
};
