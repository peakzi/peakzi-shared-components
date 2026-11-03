import { useState } from 'react'
import type { Decorator, Meta, StoryObj } from '@storybook/react'
import { BusinessSiteContactForm } from './BusinessSiteContactForm'
import type { BusinessSiteContactFormProps } from './helpers/types'
import { BusinessSiteHero } from '../BusinessSiteHero'
import { Button } from '../Button'
import { Modal } from '../Modal'
import { userEvent, within } from 'storybook/test'

const demoAddresses = [
  { id: 'example-oak', label: '123 Oak Street, Dallas, TX 75001', description: 'Dallas, Texas' },
  { id: 'example-pine', label: '123 Pine Avenue, Dallas, TX 75001', description: 'Dallas, Texas' },
]
const submitDemo: BusinessSiteContactFormProps['onSubmit'] = async (_values, { signal }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  if (signal.aborted) return
  return { success: true, message: 'Demo request received. No data was sent.' }
}
const filledValues = { fullName: 'Jordan Smith', phone: '(214) 555-0142', email: 'jordan@example.com',
  address: '123 Oak Street, Dallas, TX 75001', description: 'AC runs but blows warm air since this morning.' }
const width = (maxWidth: number): Decorator => function WidthDecorator(Story) {
  return <div style={{ maxWidth, marginInline: 'auto' }}><Story /></div>
}
const agreeAndSend: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  // The native checkbox is visually hidden, so click its label like a user would.
  await userEvent.click(canvas.getByRole('checkbox').closest('label')!)
  await userEvent.click(canvas.getByRole('button', { name: 'Send request' }))
}
const typeAddress = (text: string): NonNullable<Story['play']> => async ({ canvasElement }) => {
  await userEvent.type(within(canvasElement).getByRole('combobox'), text)
}

const meta = {
  title: 'Components/Business Site/Contact Form',
  component: BusinessSiteContactForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Reusable homeowner service-request form. Name, phone, service address and explicit contact consent are required; missing or invalid fields show their own errors rather than a form-level message. Compact omits email, uses shorter copy and pairs name/phone when space permits. Comfortable includes email, paired fields and a side introduction on wide containers. Address search is debounced and API-neutral; consumers supply the backend adapter, approved TCPA disclosure, optional policy URL and validation/submission callbacks. Story data and disclosure wording are illustrative; no requests are sent.' } },
  },
  args: {
    consentText: 'I agree to calls and text messages from Example Home Services about my request, appointment updates and notifications, including automated messages. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out of texts or HELP for assistance.',
    privacyPolicy: { href: '/privacy-policy' },
    addressSearch: { search: async (query, { signal }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return signal.aborted ? [] : demoAddresses.filter((address) => address.label.toLowerCase().includes(query.toLowerCase()))
    } },
    onSubmit: submitDemo,
    appearance: { font: 'IBM Plex Sans', headingFont: 'Archivo', backgroundColor: '#ffffff', textColor: '#12171c',
      accentColor: '#1d4f8c', buttonRadius: '8px', density: 'comfortable', motion: 'none' },
  },
  argTypes: { onSubmit: { control: false }, phoneValidation: { control: false }, addressSearch: { control: false }, appearance: { control: 'object' } },
} satisfies Meta<typeof BusinessSiteContactForm>
export default meta
type Story = StoryObj<typeof meta>

export const Comfortable: Story = {}
export const Compact: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' } }, decorators: [width(420)] }
export const Mobile: Story = { decorators: [width(340)] }
export const PaleBrandColor: Story = { args: { appearance: { ...meta.args.appearance, accentColor: '#FFD700', buttonRadius: '2px', density: 'compact' } },
  decorators: [width(420)] }
export const DarkTheme: Story = { args: { initialValues: filledValues, appearance: { ...meta.args.appearance, backgroundColor: '#12171c', textColor: '#ffffff',
  inputBackgroundColor: '#213b5a', inputTextColor: '#ffffff', accentColor: '#efbf57', buttonRadius: '16px' } } }
export const AddressSearching: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' }, addressSearch: { search: () => new Promise(() => {}) } },
  decorators: [width(420)], play: typeAddress('123 Oa') }
export const AddressNoMatch: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' } }, decorators: [width(420)], play: typeAddress('987 Zinnia') }
export const Sending: Story = { args: { initialValues: filledValues, appearance: { ...meta.args.appearance, density: 'compact', motion: 'subtle' },
  onSubmit: () => new Promise(() => {}) },
  decorators: [width(420)], play: agreeAndSend }
export const Success: Story = { args: { initialValues: filledValues, appearance: { ...meta.args.appearance, density: 'compact' },
  onSubmit: () => ({ success: true }) }, decorators: [width(420)], play: agreeAndSend }
export const BackendValidation: Story = { args: { initialValues: { fullName: 'Jordan Smith', phone: '+1 555 010 0142',
  email: 'jordan@example.com', address: '123 Example Street' },
  phoneValidation: { validate: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return 'We couldn’t verify this phone number. Please check it and try again.'
  } },
} }
export const LivePhoneValidation: Story = { args: { appearance: { ...meta.args.appearance, motion: 'subtle' }, phoneValidation: {
  validate: async (phone, { signal }) => {
    // Simulated backend latency so the in-field loader is visible.
    await new Promise((resolve) => setTimeout(resolve, 1200))
    if (!signal.aborted && phone.replace(/\D/g, '').endsWith('0199')) return 'We couldn’t verify this phone number. Please check it and try again.'
  },
} }, play: async ({ canvasElement }) => {
  await userEvent.type(within(canvasElement).getByLabelText(/Phone number/), '214 555 0199')
} }
export const BuiltInRules: Story = { args: { initialValues: { fullName: '1234', phone: '555-CALL-NOW', email: 'jordan@example', address: '123 Example Street' } },
  play: agreeAndSend }
export const SubmissionError: Story = { args: { initialValues: { fullName: 'Jordan Smith', phone: '+1 555 010 0142', address: '123 Example Street' },
  onSubmit: async () => ({ success: false, message: 'We couldn’t send your request. Please try again.' }) } }
export const Disabled: Story = { args: { disabled: true } }
export const AddressLookupFailure: Story = { args: { addressSearch: { search: async () => { throw new Error('Demo lookup failure') } } } }
export const AllFieldErrors: Story = {
  args: { initialValues: { fullName: 'Jordan', phone: '214 555 0100', email: 'jordan@example.com', address: '123', description: '?' },
    onSubmit: async () => ({ success: false, fieldErrors: { fullName: 'Please check your full name.', phone: 'Please enter a number we can reach.',
      email: 'Please check this email address.', address: 'Please choose or enter your complete service address.',
      description: 'Please add a little more detail about the problem.' } }),
  },
  play: agreeAndSend,
}
export const InHero: Story = { render: (args) => <BusinessSiteHero headline="Reliable help for your home" layout="split"
  answer="Tell our team what you need help with." background="soft"
  formContent={<BusinessSiteContactForm {...args} appearance={{ ...args.appearance, density: 'compact' }} />} /> }
export const OnContactPage: Story = { render: (args) => <main style={{ maxWidth: 1200, marginInline: 'auto' }}>
  <h1 style={{ marginBottom: 24 }}>Contact our team</h1><BusinessSiteContactForm {...args} />
</main> }

function ModalExample(args: BusinessSiteContactFormProps) {
  const [open, setOpen] = useState(false)
  return <><Button onClick={() => setOpen(true)}>Request service</Button>
    <Modal open={open} onClose={() => setOpen(false)} aria-label="Request service" size="lg">
      <BusinessSiteContactForm {...args} appearance={{ ...args.appearance, density: 'compact' }} />
    </Modal></>
}
export const InModal: Story = { render: (args) => <ModalExample {...args} /> }
