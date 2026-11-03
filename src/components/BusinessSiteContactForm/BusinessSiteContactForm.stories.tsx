import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
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

const meta = {
  title: 'Components/Business Site/Contact Form',
  component: BusinessSiteContactForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Reusable homeowner service-request form. Name, phone and explicit contact consent are required. Compact omits email, uses shorter copy and pairs name/phone when space permits. Comfortable includes email, paired fields and a side introduction on wide containers. Address search is debounced and API-neutral; consumers supply the backend adapter, approved TCPA disclosure, optional policy URL and validation/submission callbacks. Story data and disclosure wording are illustrative; no requests are sent.' } },
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
  argTypes: { onSubmit: { control: false }, onValidate: { control: false }, addressSearch: { control: false }, appearance: { control: 'object' } },
} satisfies Meta<typeof BusinessSiteContactForm>
export default meta
type Story = StoryObj<typeof meta>

export const Comfortable: Story = {}
export const Compact: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' } },
  decorators: [(Story) => <div style={{ maxWidth: 420, marginInline: 'auto' }}><Story /></div>] }
export const Mobile: Story = { decorators: [(Story) => <div style={{ maxWidth: 340, marginInline: 'auto' }}><Story /></div>] }
export const PaleBrandColor: Story = { args: { appearance: { ...meta.args.appearance, accentColor: '#FFD700' } } }
export const DarkTheme: Story = { args: { appearance: { ...meta.args.appearance, backgroundColor: '#12171c', textColor: '#ffffff',
  inputBackgroundColor: '#213b5a', inputTextColor: '#ffffff', accentColor: '#efbf57' } } }
export const BackendValidation: Story = { args: { initialValues: { fullName: 'Jordan Smith', phone: '+1 555 010 0142',
  email: 'jordan@example.com', address: '123 Example Street' },
  onValidate: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return { phone: 'We couldn’t verify this phone number. Please check it and try again.',
      address: 'Please include your city, state and ZIP code.' }
  },
} }
export const SubmissionError: Story = { args: { initialValues: { fullName: 'Jordan Smith', phone: '+1 555 010 0142' },
  onSubmit: async () => ({ success: false, message: 'We couldn’t send your request. Please try again.' }) } }
export const Disabled: Story = { args: { disabled: true } }
export const AddressLookupFailure: Story = { args: { addressSearch: { search: async () => { throw new Error('Demo lookup failure') } } } }
export const AllFieldErrors: Story = {
  args: { initialValues: { fullName: 'Jordan', phone: '123', email: 'jordan@example.com', address: '123', description: '?' },
    onValidate: async () => ({ fullName: 'Please check your full name.', phone: 'Please enter a number we can reach.',
      email: 'Please check this email address.', address: 'Please choose or enter your complete service address.',
      description: 'Please add a little more detail about the problem.' }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('checkbox'))
    await userEvent.click(canvas.getByRole('button', { name: 'Send request' }))
  },
}
export const InHero: Story = { render: (args) => <BusinessSiteHero headline="Reliable help for your home" layout="split"
  answer="Tell our team what you need help with." background="soft"
  aside={<BusinessSiteContactForm {...args} appearance={{ ...args.appearance, density: 'compact' }} />} /> }
export const OnContactPage: Story = { render: (args) => <main style={{ maxWidth: 1200, marginInline: 'auto' }}>
  <h1 style={{ marginBottom: 24 }}>Contact our team</h1><BusinessSiteContactForm {...args} />
</main> }

function ModalExample(args: BusinessSiteContactFormProps) {
  const [open, setOpen] = useState(false)
  return <><Button onClick={() => setOpen(true)}>Request service</Button>
    <Modal open={open} onClose={() => setOpen(false)} aria-label="Request service">
      <BusinessSiteContactForm {...args} appearance={{ ...args.appearance, density: 'compact' }} />
    </Modal></>
}
export const InModal: Story = { render: (args) => <ModalExample {...args} /> }
