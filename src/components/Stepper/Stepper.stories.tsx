import type { Meta, StoryObj } from '@storybook/react'
import { Stepper, StepperItem } from './Stepper'

const meta: Meta<typeof Stepper> = {
  title: 'Components/Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Vertical progress stepper for multi-step async flows.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Stepper>

export const Default: Story = {
  render: () => (
    <Stepper>
      <StepperItem status="done"   title="Scrape source" />
      <StepperItem status="done"   title="Process data" />
      <StepperItem status="active" title="Generate outline" body="Drafting sections for your site…" />
      <StepperItem status="idle"   title="Write copy" stepNumber={4} />
      <StepperItem status="idle"   title="Publish" stepNumber={5} />
    </Stepper>
  ),
}

export const AllStatuses: Story = {
  name: 'All status variants',
  render: () => (
    <Stepper>
      <StepperItem status="done"   title="Done step" />
      <StepperItem status="active" title="Active step" body="Currently running…" />
      <StepperItem status="error"  title="Error step" body="Something went wrong." />
      <StepperItem status="idle"   title="Idle step" stepNumber={4} />
    </Stepper>
  ),
}
