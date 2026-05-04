import type { Meta, StoryObj } from '@storybook/react'
import { Search, Globe, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Field, Input, Textarea, Select } from './Input'

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Input> = {
  title: 'Components/Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Text, textarea, and select controls with consistent borders, focus rings, and error styling. Always pair with a `Field` label for accessibility.',
      },
      source: { type: 'dynamic' },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
    defaultValue: { control: 'text', description: 'Initial value' },
    error: { control: 'text', description: 'Error message shown below the field (Field prop)' },
  },
  args: {
    placeholder: 'Enter a value…',
    size: 'md',
    disabled: false,
    hasError: false,
    defaultValue: 'Ana Ruiz',
    error: '',
  },
}

export default meta
type Story = StoryObj<typeof Input>

// ---------------------------------------------------------------------------
// Basic input
// ---------------------------------------------------------------------------

/** Interactive playground — change size, disabled, hasError via Controls. */
export const Default: Story = {
  decorators: [
    (Story, { args }) => <Story key={String(args.defaultValue)} />,
  ],
  render: (args) => {
    const { error, ...inputArgs } = args as typeof args & { error?: string }
    return (
      <Field label="Customer name" hint="As it appears on the invoice." id="name" error={error || undefined}>
        <Input id="name" {...inputArgs} />
      </Field>
    )
  },
}

export const WithLeadIcon: Story = {
  name: 'With lead icon',
  render: () => (
    <Field label="Search" id="search">
      <Input id="search" leadIcon={<Search size={14} />} placeholder="Search jobs…" />
    </Field>
  ),
}

export const WithError: Story = {
  name: 'With error',
  render: () => (
    <Field label="Email" required id="email" error="Enter a valid email address.">
      <Input id="email" type="email" hasError defaultValue="not-an-email" />
    </Field>
  ),
}

export const PasswordToggle: Story = {
  name: 'Password toggle',
  render: function PasswordToggleStory(args) {
    const [show, setShow] = useState(false)
    return (
      <Field label="Password" id="password">
        <Input
          id="password"
          placeholder="At least 12 characters"
          {...args}
          type={show ? 'text' : 'password'}
          defaultValue={undefined}
          trailIcon={
            <button
              type="button"
              aria-label={show ? 'Hide password' : 'Show password'}
              onClick={() => setShow((s) => !s)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--fg-3)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
        />
      </Field>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Field label="Small" id="sm">
        <Input id="sm" size="sm" placeholder="Small input" />
      </Field>
      <Field label="Medium (default)" id="md">
        <Input id="md" placeholder="Medium input" />
      </Field>
      <Field label="Large" id="lg">
        <Input id="lg" size="lg" placeholder="Large input" />
      </Field>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Field label="Locked field" id="disabled">
      <Input id="disabled" disabled defaultValue="Locked value" />
    </Field>
  ),
}

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

export const TextareaStory: Story = {
  name: 'Textarea',
  render: () => (
    <Field
      label="Notes"
      hint="Visible to dispatchers and assigned technicians."
      id="notes"
      className=""
    >
      <Textarea id="notes" placeholder="Anything the technician should know…" />
    </Field>
  ),
}

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

export const SelectStory: Story = {
  name: 'Select',
  render: () => (
    <Field label="Trade" id="trade" style={{ maxWidth: 320 } as React.CSSProperties}>
      <Select id="trade" defaultValue="">
        <option value="" disabled>
          Pick a trade…
        </option>
        <option>HVAC</option>
        <option>Plumbing</option>
        <option>Electrical</option>
        <option>Roofing</option>
      </Select>
    </Field>
  ),
}

// ---------------------------------------------------------------------------
// Composed form
// ---------------------------------------------------------------------------

export const ComposedForm: Story = {
  name: 'Composed form',
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates spacing, label hierarchy, and inline validation working together in a real form layout.',
      },
    },
  },
  render: function ComposedFormStory() {
    const [email, setEmail] = useState('')
    const emailError =
      email && !email.includes('@') ? 'Enter a valid email address.' : undefined

    return (
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="First name" id="first">
            <Input id="first" defaultValue="Jordan" />
          </Field>
          <Field label="Last name" id="last">
            <Input id="last" defaultValue="Reyes" />
          </Field>
        </div>
        <Field label="Company" id="company">
          <Input id="company" defaultValue="Reyes HVAC" />
        </Field>
        <Field label="Website" id="website">
          <Input id="website" leadIcon={<Globe size={14} />} placeholder="reyes-hvac.com" />
        </Field>
        <Field label="Email" id="email-form" required error={emailError}>
          <Input
            id="email-form"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hasError={!!emailError}
            trailIcon={
              emailError ? (
                <AlertCircle size={14} color="var(--danger)" aria-hidden />
              ) : undefined
            }
          />
        </Field>
      </form>
    )
  },
}
