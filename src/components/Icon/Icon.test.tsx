import { act, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Icon, type IconName } from './Icon'

describe('Icon', () => {
  it('forwards its ref to the SVG element', () => {
    const ref = createRef<SVGSVGElement>()
    const { container } = render(<Icon name="gemini" ref={ref} />)
    expect(ref.current).toBe(container.querySelector('svg'))
  })

  it.each(['chatgpt', 'gemini'] as const)('renders %s as decorative, theme-colored SVG by default', (name) => {
    const { container } = render(<Icon name={name} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
    expect(svg).toHaveAttribute('data-icon-variant', 'monochrome')
    expect(svg.querySelector('path')).toHaveAttribute('fill', 'currentColor')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('extracts one square ChatGPT mark without the duplicate or construction guides', () => {
    const { container } = render(<Icon name="chatgpt" />)
    const svg = container.querySelector('svg')!
    const viewBox = svg.getAttribute('viewBox')!.split(' ').map(Number)
    expect(viewBox[2]).toBe(viewBox[3])
    expect(svg.querySelectorAll('path')).toHaveLength(1)
    expect(svg.querySelector('[stroke]')).toBeNull()
  })

  it('uses an optional title as an accessible name and escapes its text', () => {
    render(<Icon name="gemini" title="  Gemini <logo>  " />)
    const image = screen.getByRole('img', { name: 'Gemini <logo>' })
    expect(image).not.toHaveAttribute('aria-hidden')
    expect(image.querySelector('logo')).toBeNull()
    expect(document.getElementById(image.getAttribute('aria-labelledby')!)).toHaveTextContent('Gemini <logo>')
  })

  it('supports aria-label and a consumer-owned aria-labelledby', () => {
    const { rerender } = render(<Icon name="chatgpt" aria-label="Ask ChatGPT" />)
    expect(screen.getByRole('img', { name: 'Ask ChatGPT' })).toBeVisible()
    rerender(<><span id="provider">Gemini provider</span><Icon name="gemini" title="Icon" aria-labelledby="provider" /></>)
    expect(screen.getByRole('img', { name: 'Gemini provider' })).toBeVisible()
  })

  it('forwards SVG attributes, sizing, classes and test identifiers', () => {
    const { rerender } = render(<Icon name="gemini" size="1em" className="provider-icon" data-source="profile" testId="icon" />)
    const svg = screen.getByTestId('icon')
    expect(svg).toHaveClass('pz-icon', 'provider-icon')
    expect(svg).toHaveAttribute('width', '1em')
    expect(svg).toHaveAttribute('height', '1em')
    expect(svg).toHaveAttribute('data-source', 'profile')
    rerender(<Icon name="gemini" size={40} width={32} height={30} data-testid="native-test-id" />)
    expect(screen.getByTestId('native-test-id')).toHaveAttribute('width', '32')
    expect(screen.getByTestId('native-test-id')).toHaveAttribute('height', '30')
  })

  it('keeps icons next to link text decorative', () => {
    render(<a href="https://example.com"><Icon name="chatgpt" />Ask ChatGPT</a>)
    expect(screen.getByRole('link', { name: 'Ask ChatGPT' })).toBeVisible()
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('preserves Gemini color artwork and scopes gradient references to each instance', () => {
    const { container } = render(<><Icon name="gemini" variant="color" /><Icon name="gemini" variant="color" /></>)
    const gradients = [...container.querySelectorAll('linearGradient')]
    expect(gradients).toHaveLength(6)
    expect(new Set(gradients.map((gradient) => gradient.id)).size).toBe(6)
    for (const svg of container.querySelectorAll('svg')) {
      expect(svg).toHaveAttribute('data-icon-variant', 'color')
      expect(svg.querySelector('path')).toHaveAttribute('fill', '#3186FF')
      expect([...svg.querySelectorAll('stop')].map((stop) => stop.getAttribute('stop-color')))
        .toEqual(['#08B962', '#08B962', '#F94543', '#F94543', '#FABC12', '#FABC12'])
      for (const path of svg.querySelectorAll('path[fill^="url("]')) {
        const id = path.getAttribute('fill')!.slice(5, -1)
        expect([...svg.querySelectorAll('linearGradient')].some((gradient) => gradient.id === id)).toBe(true)
      }
    }
  })

  it('falls back to monochrome when color artwork is unavailable', () => {
    const html = renderToStaticMarkup(<Icon name="chatgpt" variant="color" />)
    expect(html).toContain('data-icon-variant="monochrome"')
    expect(html).toContain('fill="currentColor"')
    expect(html).not.toContain('linearGradient')
  })

  it.each(['missing', '__proto__', 'constructor'])('omits unknown runtime icon names: %s', (name) => {
    expect(renderToStaticMarkup(<Icon name={name as IconName} />)).toBe('')
  })

  it('keeps title and gradient IDs stable when hydrating server HTML', async () => {
    const tree = <><Icon name="gemini" variant="color" title="Gemini" /><Icon name="gemini" variant="color" title="Gemini" /></>
    const holder = document.createElement('div')
    holder.innerHTML = renderToString(tree)
    document.body.append(holder)
    const before = holder.innerHTML
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => { root = hydrateRoot(holder, tree, { onRecoverableError }) })
      expect(onRecoverableError).not.toHaveBeenCalled()
      expect(holder.innerHTML).toBe(before)
      expect(holder.querySelectorAll('path')).toHaveLength(8)
    } finally {
      await act(async () => root?.unmount())
      holder.remove()
    }
  })
})
