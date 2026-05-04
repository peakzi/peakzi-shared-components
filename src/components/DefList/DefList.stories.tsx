import type { Meta, StoryObj } from '@storybook/react'
import { DefList, DefRow } from './DefList'

const meta: Meta<typeof DefList> = {
  title: 'Components/Data Display/DefList',
  component: DefList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Semantic <dl> key/value list for account details, metadata panels, and settings summaries.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof DefList>

export const Default: Story = {
  render: () => (
    <DefList style={{ maxWidth: 520 }}>
      <DefRow term="Account ID" value="acct_8f2a91" />
      <DefRow term="Cohort" value="Beta" />
      <DefRow term="Primary city" value="Austin, TX" />
      <DefRow term="Plan" value="Growth" />
    </DefList>
  ),
}

export const Stacked: Story = {
  name: 'Stacked layout',
  render: () => (
    <DefList layout="stacked" style={{ maxWidth: 300 }}>
      <DefRow term="Account ID" value="acct_8f2a91" />
      <DefRow term="Cohort" value="Beta" />
    </DefList>
  ),
}

export const Small: Story = {
  name: 'Small density',
  render: () => (
    <DefList size="sm" style={{ maxWidth: 480 }}>
      <DefRow term="Created" value="Jan 12, 2025" />
      <DefRow term="Last active" value="2 hours ago" />
      <DefRow term="Location" value="Denver, CO" />
    </DefList>
  ),
}
