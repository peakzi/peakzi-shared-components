import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { EditableField } from './EditableField'

const meta: Meta<typeof EditableField> = {
  title: 'Components/Data Display/EditableField',
  component: EditableField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Inline read → edit → save field. Esc cancels, Enter commits.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof EditableField>

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState('Beta')
    return (
      <EditableField
        label="Cohort"
        value={value}
        onSave={(v) => setValue(v)}
        placeholder="No cohort"
      />
    )
  },
}

export const ReadOnly: Story = {
  name: 'Read only',
  render: () => (
    <EditableField label="Account ID" value="acct_8f2a91" onSave={() => {}} readOnly />
  ),
}

export const EmptyValue: Story = {
  name: 'Empty value with placeholder',
  render: function EmptyStory() {
    const [value, setValue] = useState('')
    return (
      <EditableField
        label="Primary city"
        value={value}
        onSave={(v) => setValue(v)}
        placeholder="Not set"
      />
    )
  },
}

export const AsyncSave: Story = {
  name: 'Async save (simulated delay)',
  render: function AsyncStory() {
    const [value, setValue] = useState('Acme Corp')
    return (
      <EditableField
        label="Business name"
        value={value}
        onSave={(v) =>
          new Promise((res) =>
            setTimeout(() => { setValue(v); res() }, 800)
          )
        }
      />
    )
  },
}

export const InlineLayout: Story = {
  name: 'Inline layout',
  render: function InlineStory() {
    const [cohort, setCohort] = useState('Beta')
    const [city, setCity] = useState('Austin')
    const [stripe, setStripe] = useState('cus_8f2a91xz')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 480 }}>
        <EditableField label="Cohort"      value={cohort}  onSave={setCohort}  layout="inline" />
        <EditableField label="Primary city" value={city}   onSave={setCity}    layout="inline" />
        <EditableField label="Stripe ID"   value={stripe}  onSave={setStripe}  layout="inline" readOnly />
      </div>
    )
  },
}
