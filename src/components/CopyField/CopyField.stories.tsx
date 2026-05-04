import type { Meta, StoryObj } from '@storybook/react'
import { CopyField } from './CopyField'

const meta: Meta<typeof CopyField> = {
  title: 'Components/Data Display/CopyField',
  component: CopyField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Read-only label/value with a copy-to-clipboard button. Shows "Copied" feedback for 1.5s.',
      },
    },
  },
  args: {
    label: 'Account ID',
    value: 'acct_8f2a91c4d3e2',
  },
}

export default meta
type Story = StoryObj<typeof CopyField>

export const Default: Story = {}

export const WithoutLabel: Story = {
  name: 'Without label',
  args: { label: undefined, value: 'sk-live_8f2a91c4d3e2' },
}

export const NotMono: Story = {
  name: 'Non-monospace value',
  args: { label: 'Display name', value: 'Acme Corp', mono: false },
}

export const MultipleFields: Story = {
  name: 'Multiple fields',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <CopyField label="Account ID" value="acct_8f2a91c4d3e2" />
      <CopyField label="Stripe Customer" value="cus_Nffrh7Gy3bLq" />
      <CopyField label="API Key" value="sk-live_8f2a91c4d3e2" />
    </div>
  ),
}
