// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default [js.configs.recommended, {
  files: ['src/**/*.{ts,tsx}'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
  },
  rules: {
    // TypeScript
    ...tsPlugin.configs.recommended.rules,
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',

    // React
    ...reactPlugin.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off', // Not needed with react-jsx transform
    'react/prop-types': 'off',         // TypeScript handles this
    'react/display-name': 'error',

    // React Hooks
    ...reactHooksPlugin.configs.recommended.rules,

    // Accessibility / SEO (semantic HTML enforcement)
    'no-restricted-syntax': [
      'error',
      {
        // Disallow onClick on non-interactive elements
        selector: 'JSXOpeningElement[name.name=/^(div|span|p|section|article)$/] > JSXAttribute[name.name="onClick"]',
        message: 'Use a semantic interactive element (<button> or <a>) instead of adding onClick to a non-interactive element.',
      },
    ],
  },
  settings: {
    react: { version: 'detect' },
  },
}, ...storybook.configs['flat/recommended'], {
  // Relaxed rules for test and story files
  files: ['**/*.test.tsx', '**/*.stories.tsx'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-restricted-syntax': 'off',
    'storybook/no-renderer-packages': 'off',
  },
}]
