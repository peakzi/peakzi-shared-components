import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Inline status banners with ARIA role="alert" for screen reader announcements. Four variants: info, success, warning, danger.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'AI scan in progress',
    children: 'Your business profile is being analysed. This usually takes under 2 minutes.',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Profile published',
    children: 'Your changes are live and will appear in AI citations within 24 hours.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Missing information',
    children: 'Add your service area to improve your local AI visibility score.',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Payment failed',
    children: 'Your card ending in 4242 was declined. Please update your payment method.',
  },
}

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert variant="info" title="Information">Something useful to know.</Alert>
      <Alert variant="success" title="Success">Action completed successfully.</Alert>
      <Alert variant="warning" title="Warning">Please review before continuing.</Alert>
      <Alert variant="danger" title="Error">Something went wrong. Please try again.</Alert>
    </div>
  ),
}

export const TitleOnly: Story = {
  name: 'Title only',
  args: {
    variant: 'success',
    title: 'Changes saved',
  },
}

export const NoIcon: Story = {
  name: 'Without icon',
  args: {
    variant: 'info',
    title: 'Note',
    hideIcon: true,
    children: 'Icons can be hidden for minimal layouts.',
  },
}
