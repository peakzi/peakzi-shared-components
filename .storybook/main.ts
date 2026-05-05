import { resolve } from 'path'
import type { StorybookConfig } from '@storybook/react-vite'

/**
 * Storybook configuration for Peakzi Component Library.
 *
 * Key addons:
 * - addon-a11y:     Checks ARIA and contrast — 0 violations required before shipping to consumer repos
 * - addon-themes:   Light / dark mode toggle wired to CSS [data-theme] attribute
 * - addon-docs:     Auto-generates docs from JSDoc + TypeScript prop types
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: resolve(process.cwd(), 'tsconfig.json'),
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
}

export default config
