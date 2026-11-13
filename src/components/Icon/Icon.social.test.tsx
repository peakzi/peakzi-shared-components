import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Icon, type IconAppearance, type IconSurface, type IconVariant } from './Icon'
import { iconDefinitions } from './icons'

describe('social Icon artwork', () => {
  it.each(Object.keys(iconDefinitions) as (keyof typeof iconDefinitions)[])('supports the same public props for %s and all treatments', (name) => {
    for (const variant of ['monochrome', 'color'] satisfies IconVariant[]) {
      for (const appearance of ['filled', 'outline'] satisfies IconAppearance[]) {
        for (const surface of ['light', 'dark'] satisfies IconSurface[]) {
          const html = renderToStaticMarkup(<Icon name={name} variant={variant} appearance={appearance} surface={surface} size="1em" title={name} />)
          const holder = document.createElement('div')
          holder.innerHTML = html
          const svg = holder.querySelector('svg')!
          expect(svg).toHaveAttribute('width', '1em')
          expect(svg).toHaveAttribute('height', '1em')
          expect(svg).toHaveAttribute('role', 'img')
          expect(svg.getAttribute('viewBox')!.split(' ').map(Number).every(Number.isFinite)).toBe(true)
          expect(svg).not.toHaveAttribute('appearance')
          expect(svg).not.toHaveAttribute('surface')
          expect(svg.querySelector('script')).toBeNull()
          const paths = [...svg.querySelectorAll('path')]
          expect(paths.length).toBeGreaterThan(0)
          expect(paths.every(path => Boolean(path.getAttribute('d')?.trim()))).toBe(true)
        }
      }
    }
  })

  it('uses available artwork when the requested treatment is missing', () => {
    const { container, rerender } = render(<Icon name="tiktok" appearance="outline" variant="color" />)
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-appearance', 'filled')
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-variant', 'monochrome')
    expect(container.querySelector('path')).toHaveAttribute('fill', 'currentColor')
    expect(container.querySelector('[stroke]')).toBeNull()
    rerender(<Icon name="google-business" appearance="filled" />)
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-appearance', 'outline')
    expect(container.querySelector('g')).toHaveAttribute('stroke', 'currentColor')
    rerender(<Icon name="instagram" appearance="outline" />)
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-appearance', 'filled')
  })

  it('keeps all five Yelp symbol segments in each color treatment', () => {
    const { container, rerender } = render(<Icon name="yelp" variant="color" />)
    expect(container.querySelector('path')!.getAttribute('d')!.match(/M/g)).toHaveLength(5)
    expect(container.querySelector('path')).toHaveAttribute('fill', '#FF1A1A')
    expect(container.querySelectorAll('path')).toHaveLength(1)
    rerender(<Icon name="yelp" variant="color" surface="dark" />)
    expect(container.querySelector('path')).toHaveAttribute('fill', '#FFFFFF')
    expect(container.querySelector('path')!.getAttribute('d')!.match(/M/g)).toHaveLength(5)
    rerender(<Icon name="yelp" />)
    expect(container.querySelector('path')).toHaveAttribute('fill', 'currentColor')
  })

  it('selects supplied light/dark color artwork while monochrome always inherits text color', () => {
    const { container, rerender } = render(<Icon name="x" variant="color" />)
    expect(container.querySelector('path')).toHaveAttribute('fill', '#000000')
    rerender(<Icon name="x" variant="color" surface="dark" />)
    expect(container.querySelector('path')).toHaveAttribute('fill', '#FFFFFF')
    rerender(<Icon name="x" surface="dark" />)
    expect(container.querySelector('path')).toHaveAttribute('fill', 'currentColor')
    rerender(<Icon name="facebook" variant="color" />)
    expect(container.querySelectorAll('path')).toHaveLength(2)
    expect(container.querySelector('path')).toHaveAttribute('fill', '#0866FF')
    expect(container.querySelector('image')).toBeNull()
  })

  it('preserves Angi original colors and selects the supplied outline independently', () => {
    const { container, rerender } = render(<Icon name="angi" variant="color" />)
    expect([...container.querySelectorAll('path')].map(path => path.getAttribute('fill'))).toEqual(['#a03027', '#ff6153'])
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 150 150')
    // The transparent source canvas is excluded from the icon geometry.
    expect(container.querySelectorAll('path')).toHaveLength(2)
    rerender(<Icon name="angi" />)
    expect(container.querySelectorAll('path[fill="currentColor"]')).toHaveLength(2)
    rerender(<Icon name="angi" appearance="outline" variant="color" />)
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 48 48')
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-appearance', 'outline')
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-variant', 'monochrome')
    expect(container.querySelector('g')).toHaveAttribute('stroke', 'currentColor')
    expect(container.querySelectorAll('path')).toHaveLength(4)
  })

  it('uses both supplied BBB marks with cropped canvas space and monochrome color fallback', () => {
    const { container, rerender } = render(<Icon name="bbb" variant="color" />)
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 9.939 56.48 36.603')
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-appearance', 'filled')
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-variant', 'monochrome')
    expect(container.querySelectorAll('path[fill="currentColor"]')).toHaveLength(1)
    rerender(<Icon name="bbb" appearance="outline" variant="color" surface="dark" />)
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 76.942 511.999 358.115')
    expect(container.querySelector('svg')).toHaveAttribute('data-icon-appearance', 'outline')
    expect(container.querySelectorAll('path[fill="currentColor"]')).toHaveLength(8)
  })

  it('renders YouTube and LinkedIn as vector paths without raster images, masks, filters or data URIs', () => {
    const { container, rerender } = render(<Icon name="youtube" variant="color" />)
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 396.532 277.776')
    expect(container.querySelectorAll('path')).toHaveLength(2)
    expect(container.querySelector('path')).toHaveAttribute('fill', '#FF0033')
    for (const name of ['youtube', 'linkedin'] as const) {
      for (const variant of ['monochrome', 'color'] as const) {
        for (const surface of ['light', 'dark'] as const) {
          rerender(<Icon name={name} variant={variant} surface={surface} />)
          expect(container.querySelector('image, mask, filter')).toBeNull()
          expect(container.innerHTML).not.toContain('data:image/')
          expect(container.querySelector('path')).toHaveAttribute('fill-rule', 'evenodd')
          if (variant === 'monochrome') expect(container.querySelector('path')).toHaveAttribute('fill', 'currentColor')
        }
      }
    }
  })

  it('scopes gradient and clip-path references to each instance', () => {
    const { container } = render(<>{[0, 1].map(i => <span key={i}>
      <Icon name="instagram" variant="color" /><Icon name="gemini" variant="color" />
    </span>)}</>)
    const ids = [...container.querySelectorAll('[id]')].map(e => e.id)
    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
    for (const svg of container.querySelectorAll('svg')) {
      for (const element of svg.querySelectorAll('[clip-path], [fill^="url("]')) {
        for (const attribute of ['clip-path', 'fill']) {
          const value = element.getAttribute(attribute)
          if (!value?.startsWith('url(#')) continue
          const id = value.slice(5, -1)
          expect([...svg.querySelectorAll('[id]')].some(e => e.id === id)).toBe(true)
        }
      }
    }
    // The clip stays outside the image transform so the glyph geometry remains unchanged.
    expect(container.querySelector('g[clip-path] image')).toHaveAttribute('transform', 'translate(-703.26 -703.26) scale(1.56)')
  })

  it('keeps the Instagram gradient small and its glyph edge vector-based', () => {
    const jpeg = readFileSync(resolve('src/components/Icon/icons/assets/instagram-gradient.jpg'))
    expect(jpeg.length).toBeLessThan(4_000)
    expect(jpeg.readUInt16BE(0)).toBe(0xffd8)
    const html = renderToStaticMarkup(<Icon name="instagram" variant="color" />)
    expect(html).toContain('<clipPath')
    expect(html).toContain('<path')
  })
})
