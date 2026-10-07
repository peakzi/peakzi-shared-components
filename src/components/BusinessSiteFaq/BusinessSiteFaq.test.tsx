import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { render, screen } from '@testing-library/react'
import { BusinessSiteFaq } from './BusinessSiteFaq'
import type { BusinessSiteFaqItem } from './helpers/types'

const items: BusinessSiteFaqItem[] = [
  { id: 'estimate', question: 'How do I request an estimate?', answer: 'Call our team to discuss the work.' },
  { id: 'areas', question: 'Where do you work?', answer: 'See the listed service areas.' },
]

describe('BusinessSiteFaq', () => {
  it('includes every question and answer in the server HTML, with the first answer open', () => {
    const html = renderToStaticMarkup(<BusinessSiteFaq items={items} />)
    expect(html).toContain('<h2')
    expect(html).not.toContain('<h1')
    expect(html).toContain('How do I request an estimate?')
    expect(html).toContain('Call our team to discuss the work.')
    expect(html).toContain('See the listed service areas.')
    expect(html.match(/open=""/g)).toHaveLength(1)
    expect(html.match(/<summary>/g)).toHaveLength(2)
    expect(html).not.toContain('aria-hidden="true">Call our team')
  })

  it('can start with all answers closed', () => {
    const html = renderToStaticMarkup(<BusinessSiteFaq items={items} defaultOpenFirst={false} />)
    expect(html).not.toContain('open=""')
    expect(html).toContain('Call our team to discuss the work.')
  })

  it('groups each instance separately and labels its section', () => {
    const { container } = render(<><BusinessSiteFaq items={items} /><BusinessSiteFaq items={items} /></>)
    const groups = [...container.querySelectorAll('details')].map((item) => item.getAttribute('name'))
    expect(groups[0]).toBe(groups[1])
    expect(groups[2]).toBe(groups[3])
    expect(groups[0]).not.toBe(groups[2])
    for (const section of container.querySelectorAll('section')) {
      expect(document.getElementById(section.getAttribute('aria-labelledby')!)).toHaveTextContent('Frequently asked questions')
    }
  })

  it('stacks both toggle icons in one decorative wrapper so CSS can turn one into the other', () => {
    const { container } = render(<BusinessSiteFaq items={items} />)
    const icons = container.querySelectorAll('summary > .pz-business-faq__icon')
    expect(icons).toHaveLength(2)
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
      expect(icon.querySelector('.pz-business-faq__expand')).toBeInTheDocument()
      expect(icon.querySelector('.pz-business-faq__collapse')).toBeInTheDocument()
    }
  })

  it('omits the section when there are no usable answers', () => {
    expect(renderToStaticMarkup(<BusinessSiteFaq items={[]} />)).toBe('')
    expect(renderToStaticMarkup(<BusinessSiteFaq items={[
      { id: 'blank-question', question: ' ', answer: 'An answer' },
      { id: 'blank-answer', question: 'A question', answer: ' ' },
      { id: 'null-answer', question: 'A question', answer: null },
    ]} />)).toBe('')
  })

  it('renders rich answer content without requiring a client renderer', () => {
    const html = renderToStaticMarkup(<BusinessSiteFaq items={[{
      id: 'steps', question: 'What are the steps?', answer: <><p>These steps:</p><ul><li>Contact our team</li></ul></>,
    }]} />)
    expect(html).toContain('<ul><li>Contact our team</li></ul>')
  })

  it('uses valid contact links and protects new-tab actions', () => {
    render(<BusinessSiteFaq items={items} contact={{
      title: 'Still have questions?', description: 'Get in touch.', actions: [
        { id: 'call', label: 'Call us', href: 'tel:5125550188', iconName: 'phone' },
        { id: 'book', label: 'Book online', href: 'https://example.com/book', newTab: true, iconName: 'arrow-up-right', iconPosition: 'after' },
        { id: 'unsafe', label: 'Unsafe', href: 'javascript:alert(1)' },
        { id: 'blank', label: ' ', href: '/contact' },
      ],
    }} />)
    expect(screen.getByRole('link', { name: 'Call us' })).toHaveAttribute('href', 'tel:5125550188')
    expect(screen.getByRole('link', { name: 'Book online' })).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByRole('link', { name: 'Book online' })).toHaveAttribute('target', '_blank')
    expect(screen.queryByText('Unsafe')).not.toBeInTheDocument()
  })

  it('keeps the contact card optional and supports a text-only contact card', () => {
    expect(renderToStaticMarkup(<BusinessSiteFaq items={items} />)).not.toContain('pz-business-faq__contact')
    const html = renderToStaticMarkup(<BusinessSiteFaq items={items} contact={{ title: 'Get in touch' }} />)
    expect(html).toContain('Get in touch')
    expect(html).not.toContain('pz-business-faq__actions')
  })

  it.each([undefined, 'none', 'subtle'] as const)('uses the website motion setting %s', (motion) => {
    const html = renderToStaticMarkup(<BusinessSiteFaq items={items} appearance={motion ? { motion } : {}} />)
    expect(html).toContain(`data-motion="${motion ?? 'none'}"`)
  })

  it('uses website colors, fonts, radius and density', () => {
    const html = renderToStaticMarkup(<BusinessSiteFaq items={items} appearance={{
      font: 'Nunito Sans', headingFont: 'Archivo', backgroundColor: '#101820', textColor: '#ffffff',
      accentColor: '#a5c9ee', contactBackgroundColor: '#12171c', contactGradientEndColor: '#716a64',
      contactTextColor: '#ffffff', buttonRadius: '32px', density: 'compact',
    }} />)
    expect(html).toContain('data-density="compact"')
    expect(html).toContain('--pz-business-faq-background:#101820')
    expect(html).toContain('--pz-business-faq-text:#ffffff')
    expect(html).toContain('--pz-business-faq-accent:#a5c9ee')
    expect(html).toContain('--pz-business-faq-contact-end:#716a64')
    expect(html).toContain('--pz-business-faq-radius:32px')
    expect(html).toContain('Nunito Sans')
  })

  it('falls back from invalid appearance values and unreadable contact text', () => {
    const html = renderToStaticMarkup(<BusinessSiteFaq items={items} appearance={{
      backgroundColor: 'url(unsafe)', font: 'bad; font', contactBackgroundColor: '#ffffff', contactTextColor: '#ffffff',
    }} />)
    expect(html).not.toContain('unsafe')
    expect(html).not.toContain('bad; font')
    expect(html).toContain('--pz-business-faq-background:#ffffff')
    expect(html).toContain('--pz-business-faq-contact-text:#000000')
  })
})
