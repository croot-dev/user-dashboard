module.exports = {
  env: {
    browser: true,
    node: true
  },
  plugins: ['vue', 'check-file', 'import'],
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'plugin:nuxt/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.cjs'],
  settings: {
    'import/resolver': {
      typescript: {}
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  },
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    indent: ['error', 2],
    'vue/multi-word-component-names': 'off',
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
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'object', 'internal'],
        pathGroups: [
          {
            pattern: '~/*',
            group: 'external',
            position: 'after'
          },
          {
            pattern: './*',
            group: 'internal',
            position: 'after'
          }
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  }
}
