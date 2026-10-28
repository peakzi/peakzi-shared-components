import type { Meta, StoryObj } from '@storybook/react'
import { BusinessSitePolicy } from './BusinessSitePolicy'

const meta = {
  title: 'Components/Business Site/Policy', component: BusinessSitePolicy, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Server-safe legal reading layout. Applications supply safely rendered policy content, heading, breadcrumb and website theme. No generated legal text, API calls, hero or promotional CTA.' } } },
  args: { breadcrumb: <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>Privacy policy</li></ol></nav>,
    children: <><h1>Privacy policy</h1><p><strong>Effective date:</strong> Supplied by the company</p><p>Company-provided policy content is rendered here without rewriting.</p><h2>Policy section</h2><p>Readable paragraphs, <a href="#questions">links</a>, and lists use the existing website theme.</p><ul><li>Company-provided item</li><li>Another policy item</li></ul><h2 id="questions">Questions</h2><p>Company-provided contact details appear here.</p></>,
    appearance: { font: 'system-ui', headingFont: 'system-ui', backgroundColor: '#ffffff', textColor: '#01173c', accentColor: '#01173c', density: 'comfortable' },
  },
} satisfies Meta<typeof BusinessSitePolicy>
export default meta
type Story = StoryObj<typeof meta>
export const Reading: Story = {}
export const Mobile: Story = { decorators: [(Story) => <div style={{ maxWidth: '390px', margin: 'auto' }}><Story /></div>] }
export const Compact: Story = { args: { appearance: { ...meta.args.appearance, density: 'compact' } } }
