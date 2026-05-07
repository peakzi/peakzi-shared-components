import type { Meta, StoryObj } from '@storybook/react'
import { PeakziLogo } from './PeakziLogo'

const meta: Meta<typeof PeakziLogo> = {
  title: 'Components/Brand/PeakziLogo',
  component: PeakziLogo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Official Peakzi brand mark. Use `color` on light backgrounds, `white` on dark/navy, and `icon`/`icon-navy` in compact spaces. Change any control below to see the logo update live.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['color', 'white', 'icon', 'icon-navy', 'auto'],
      description: 'Which asset to render. `auto` swaps color ↔ white based on [data-theme].',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Height of the logo',
    },
    href: {
      control: 'text',
      description: 'Wraps the logo in an <a> — omit for a plain <span>',
    },
    alt: {
      control: 'text',
      description: 'Accessible label (auto-set based on variant if omitted)',
    },
  },
  // Default args apply to every story — controls update these live
  args: {
    variant: 'color',
    size: 'md',
  },
  // Wrap all stories so white variant is always legible
  decorators: [
    (Story, ctx) => {
      const needsDark = ctx.args['variant'] === 'white'
      return needsDark ? (
        <div
          style={{
            background: '#0C0B2E',
            padding: '2rem',
            borderRadius: 8,
            display: 'inline-block',
          }}
        >
          <Story />
        </div>
      ) : (
        <Story />
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof PeakziLogo>

/**
 * The interactive playground — use the Controls panel to change variant and
 * size and see the logo update immediately.
 */
export const Default: Story = {}

/** Full logo on a navy background — change size in Controls. */
export const White: Story = {
  args: { variant: 'white' },
}

/** Icon-only mark — useful in favicons, app icons, and tight spaces. */
export const Icon: Story = {
  args: { variant: 'icon' },
}

/** Icon with built-in navy background. */
export const IconNavy: Story = {
  name: 'Icon (navy bg)',
  args: { variant: 'icon-navy' },
}

/** Wrap in an `<a href>` to make it a home link in a navbar. */
export const AsLink: Story = {
  args: { href: '/' },
}
