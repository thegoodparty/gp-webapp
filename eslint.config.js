const js = require('@eslint/js')
const globals = require('globals')
const tsParser = require('@typescript-eslint/parser')
const typescriptEslint = require('@typescript-eslint/eslint-plugin')
const react = require('eslint-plugin-react')
const unusedImports = require('eslint-plugin-unused-imports')
const stylistic = require('@stylistic/eslint-plugin')

const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

module.exports = [
  {
    ignores: [
      'ai-rules/',
      'e2e-tests/playwright-report/',
      'e2e-tests/test-results/',
      'e2e-tests/**/*.md',
      'test-results/',
      'styleguide/*.md',
      'public/',
      'CLAUDE.md',
      'docs/*.md',
      'gpApi/CLAUDE.md',
      '.claude/**/*.md',
      '**/.next/**',
      '**/.storybook/**',
      'eslint.config.js',
      // Preserve legacy coverage: ESLint v8 only linted .ts/.tsx (via the
      // overrides) and .md (via mdx). .js/.jsx/.mjs/.cjs were never linted.
      '**/*.js',
      '**/*.jsx',
      '**/*.mjs',
      '**/*.cjs',
    ],
  },

  // Next.js (next/core-web-vitals) + mdx, loaded via FlatCompat since
  // eslint-config-next and eslint-plugin-mdx don't ship native flat presets.
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('plugin:mdx/recommended'),

  {
    plugins: {
      react,
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
    },

    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    settings: {
      'mdx/code-blocks': true,
      'react-hooks/exhaustive-deps': false,
      'mdx/language-mapper': {},
    },

    rules: {
      '@stylistic/semi': ['error', 'never'],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['styleguide/stories/**'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'all',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx'],

    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },

  {
    files: ['styleguide/stories/**/*.ts', 'styleguide/stories/**/*.tsx'],

    languageOptions: {
      parser: tsParser,
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    rules: {
      'react-hooks/rules-of-hooks': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'all',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
]
