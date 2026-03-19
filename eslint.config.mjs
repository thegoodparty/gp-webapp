import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import react from 'eslint-plugin-react'
import unusedImports from 'eslint-plugin-unused-imports'
import stylistic from '@stylistic/eslint-plugin'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import sonarjs from 'eslint-plugin-sonarjs'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import storybook from 'eslint-plugin-storybook'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  // Global ignores
  {
    ignores: [
      'e2e-tests/playwright-report/**/*',
      'e2e-tests/**/*.md',
      'styleguide/*.md',
      'public/',
      'ai-rules/',
      'CLAUDE.md',
      '.next/**/*',
      'postcss.config.mjs',
      'eslint.config.mjs',
      '.eslintrc.test.json',
    ],
  },

  // Extend Next.js and MDX configs
  ...compat.extends('next/core-web-vitals', 'plugin:mdx/recommended'),

  // Storybook flat config (ESM native!)
  ...storybook.configs['flat/recommended'],

  // Main config for TypeScript/TSX files (excluding files not in tsconfig)
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['styleguide/stories/**/*', '.storybook/**/*', 'e2e-tests/**/*'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },

    plugins: {
      react,
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
      '@typescript-eslint': typescriptEslint,
      sonarjs,
      'simple-import-sort': simpleImportSort,
    },

    settings: {
      'mdx/code-blocks': true,
      'react-hooks/exhaustive-deps': false,
      'mdx/language-mapper': {},
    },

    rules: {
      // Basic rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      '@stylistic/semi': ['error', 'never'],
      'unused-imports/no-unused-imports': 'error',
      'no-unreachable': 'error',

      // TypeScript baseline rules (ported from coworker's .eslintrc.json changes)
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

      // Auto-fixable rules (error - blocking)
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',

      // Enforce vitest for testing (block node:test)
      'no-restricted-imports': [
        'error',
        {
          name: 'node:test',
          message: 'Use vitest instead of node:test',
        },
      ],

      // Code Quality Metrics (warn - non-blocking)
      'max-lines-per-function': ['warn', { max: 150 }],
      'max-lines': ['warn', { max: 800 }],
      'max-params': ['warn', 4],
      'max-depth': ['warn', 3],
      complexity: ['warn', 15],
      'sonarjs/cognitive-complexity': ['warn', 20],
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'warn',

      // SonarJS Bug Detection (error - high confidence bugs)
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/non-existent-operator': 'error',

      // SonarJS Code Smells (warn - should fix but not blocking)
      'sonarjs/no-duplicated-branches': 'warn',
      'sonarjs/no-useless-catch': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/no-collection-size-mischeck': 'warn',

      // Type Safety (error - suppressed with native ESLint suppressions)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',

      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'class', format: ['PascalCase'] },
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
        { selector: 'enum', format: ['PascalCase'] },
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE', 'camelCase'],
        },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        {
          // Destructured variables often mirror external API or DB column names
          selector: 'variable',
          modifiers: ['destructured'],
          format: null,
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allowSingleOrDouble',
        },
        {
          // Destructured parameters often mirror external API or DB column names
          selector: 'parameter',
          modifiers: ['destructured'],
          format: null,
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
      ],

      // Type Safety (error - suppressed with native ESLint suppressions)
      '@typescript-eslint/no-unsafe-type-assertion': 'error',

      // Disabled Auto-Fix Rules (Phase 2):
      // The following rules are imported but not enabled due to auto-fix spam.
      // They will be re-enabled in a separate PR after team approval:
      //
      // 'simple-import-sort/imports': 'error',
      // 'simple-import-sort/exports': 'error',
      // '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },

  // Config for story files (without TypeScript type checking)
  {
    files: ['styleguide/stories/**/*.ts', 'styleguide/stories/**/*.tsx'],

    plugins: {
      react,
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
      '@typescript-eslint': typescriptEslint,
      sonarjs,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      // Basic rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      '@stylistic/semi': ['error', 'never'],
      'unused-imports/no-unused-imports': 'error',

      // TypeScript baseline rules
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

      // Code Quality Metrics (relaxed for stories)
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      complexity: 'off',
    },
  },

  // Override for MDX files
  {
    files: ['**/*.md', '**/*.mdx'],
    rules: {
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  },

  // Override for test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
    },
  },
]
