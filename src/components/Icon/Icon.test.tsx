import { createRef } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter'
import { Icon, type IconName } from './Icon'

const names: IconName[] = ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'youtube', 'bbb', 'yelp', 'angi']

describe('Icon', () => {
  it.each(names)('renders local artwork for %s', (name) => {
    const { container } = render(<Icon name={name} title={name} />)
    const icon = screen.getByRole('img', { name })
    expect(icon).toHaveAttribute('data-icon', name)
    expect(icon).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet')
    const paths = icon.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
    paths.forEach((path) => expect(path.getAttribute('d')).toBeTruthy())
    expect(container.querySelector('img, image, use, script')).toBeNull()
  })

  it('defaults to black at 24 by 24 without inheriting a parent colour', () => {
    render(<span style={{ color: 'red' }}><Icon name="facebook" testId="icon" /></span>)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('color', 'black')
    expect(icon.querySelector('path')).toHaveAttribute('fill', 'currentColor')
    expect(icon).toHaveAttribute('width', '24')
    expect(icon).toHaveAttribute('height', '24')
  })

  it('accepts a theme colour and numeric size from the consuming app', () => {
    render(<Icon name="instagram" color="var(--site-accent)" size={32} testId="icon" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('color', 'var(--site-accent)')
    expect(icon).toHaveAttribute('width', '32')
    expect(icon).toHaveAttribute('height', '32')
  })

  it('accepts currentColor and relative SVG lengths', () => {
    render(<Icon name="youtube" color="currentColor" size="1.5em" testId="icon" />)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('color', 'currentColor')
    expect(icon).toHaveAttribute('width', '1.5em')
    expect(icon).toHaveAttribute('height', '1.5em')
  })

  it('uses the X artwork for the existing twitter platform key', () => {
    const { container } = render(<Icon name="twitter" />)
    expect(container.querySelector('path')).toHaveAttribute('d', faXTwitter.icon[4])
  })

  it('keeps decorative icons hidden and unfocusable inside labelled links', () => {
    render(<a href="https://www.facebook.com/AllAmericanPHA" aria-label="Facebook"><Icon name="facebook" testId="icon" /></a>)
    expect(screen.getByRole('link', { name: 'Facebook' })).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('icon')).toHaveAttribute('focusable', 'false')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('connects standalone titles to unique accessible names', () => {
    render(<><Icon name="bbb" title="  Better Business Bureau  " /><Icon name="bbb" title="Second BBB logo" /></>)
    const first = screen.getByRole('img', { name: 'Better Business Bureau' })
    const second = screen.getByRole('img', { name: 'Second BBB logo' })
    const firstId = first.getAttribute('aria-labelledby')
    expect(firstId).toBeTruthy()
    expect(first.querySelector('title')).toHaveAttribute('id', firstId)
    expect(second.getAttribute('aria-labelledby')).not.toBe(firstId)
    expect(first).not.toHaveAttribute('aria-hidden')
  })

  it('supports aria-label and caller-owned aria-labelledby without conflicting IDs', () => {
    const { rerender } = render(<Icon name="angi" title="Angi logo" aria-label="Find us on Angi" />)
    const labelled = screen.getByRole('img', { name: 'Find us on Angi' })
    expect(labelled).not.toHaveAttribute('aria-labelledby')
    rerender(<><span id="angi-label">Our Angi profile</span><Icon name="angi" title="Angi" aria-labelledby="angi-label" /></>)
    expect(screen.getByRole('img', { name: 'Our Angi profile' })).toHaveAttribute('aria-labelledby', 'angi-label')
  })

  it('ignores whitespace-only titles', () => {
    const { container } = render(<Icon name="yelp" title="   " />)
    expect(container.querySelector('title')).toBeNull()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards refs, SVG attributes, and extra classes', () => {
    const ref = createRef<SVGSVGElement>()
    render(<Icon ref={ref} name="linkedin" className="footer-social" id="linkedin-icon" testId="icon" />)
    expect(ref.current).toBe(screen.getByTestId('icon'))
    expect(ref.current).toHaveAttribute('id', 'linkedin-icon')
    expect(ref.current).toHaveClass('pz-icon', 'footer-social')
  })

  it.each(['unknown', '__proto__', 'constructor'])('ignores unsupported runtime names: %s', (name) => {
    const { container } = render(<Icon name={name as IconName} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('server-renders all logos without image placeholders or client scripts', () => {
    const html = renderToStaticMarkup(<>{names.map((name) => <Icon key={name} name={name} title={name} />)}</>)
    expect(html.match(/<svg\b/g)).toHaveLength(9)
    expect(html).toContain('data-icon="bbb"')
    expect(html).toContain('data-icon="angi"')
    expect(html).not.toMatch(/<img\b|<script\b|<image\b|<use\b/)
  })
  it('allows width and height to override size individually', () => {
    render(<Icon name="facebook" size={40} width={32} height={30} testId="icon" />)
    expect(screen.getByTestId('icon')).toHaveAttribute('width', '32')
    expect(screen.getByTestId('icon')).toHaveAttribute('height', '30')
  })

  it('keeps title IDs stable during hydration', async () => {
    const tree = <><Icon name="facebook" title="Facebook" /><Icon name="bbb" title="BBB" /></>
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
    } finally {
      await act(async () => root?.unmount())
      holder.remove()
    }
  })

})
