import type { Meta, StoryObj } from '@storybook/react'
import { AppFooter } from './AppFooter'

const meta: Meta<typeof AppFooter> = {
  title: 'Components/App Shell/AppFooter',
  component: AppFooter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Slim app-shell footer. Renders `© {text} {version}` aligned by `position`.',
      },
    },
  },
  argTypes: {
    text:             { control: 'text' },
    version:          { control: 'text' },
    position:         { control: 'select', options: ['left', 'center', 'right'] },
    versionPlacement: { control: 'radio', options: ['inline', 'block'] },
  },
  args: {
    text:     'Peakzi Copyright',
    version:  'v3.14.0',
    position: 'center',
  },
}

export default meta
type Story = StoryObj<typeof AppFooter>

/** Interactive playground — change text, version, and position. */
export const Default: Story = {}

export const Left: Story = {
  args: { position: 'left' },
}

export const Right: Story = {
  args: { position: 'right' },
}

export const NoVersion: Story = {
  name: 'Without version',
  args: { version: undefined },
}

export const VersionOnNewLine: Story = {
  name: 'Version on new line',
  args: { versionPlacement: 'block' },
}
