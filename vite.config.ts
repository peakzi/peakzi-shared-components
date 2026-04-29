import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

const componentEntries = [
  'Accordion',
  'Alert',
  'Avatar',
  'Badge',
  'Breadcrumbs',
  'Button',
  'Card',
  'Checkbox',
  'Dropdown',
  'Input',
  'Modal',
  'Navbar',
  'PeakziLogo',
  'Progress',
  'Switch',
  'Table',
  'Tabs',
  'Tooltip',
] as const

const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  styles: resolve(__dirname, 'src/styles.ts'),
  ...Object.fromEntries(
    componentEntries.map((name) => [name, resolve(__dirname, `src/components/${name}/index.ts`)]),
  ),
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.tsx', 'src/test/**'],
      entryRoot: 'src',
    }),
  ],
  build: {
    lib: {
      entry: entries,
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // Consumers supply shared runtime dependencies; keep them out of this bundle.
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'lucide-react': 'lucideReact',
        },
      },
    },
    // Emit a single CSS file for the package "./styles" export.
    cssCodeSplit: false,
    cssFileName: 'components',
    assetsInlineLimit: 0,
    sourcemap: true,
  },
})
