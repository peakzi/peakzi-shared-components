import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BlogCoverImage } from './BlogCoverImage'

describe('directory blog image recovery', () => {
  it('includes the image and reserved dimensions in server HTML', () => {
    const html = renderToStaticMarkup(<BlogCoverImage title="Article" cover={{ src: '/cover.jpg', alt: 'Work pictured' }} />)
    expect(html).toContain('src="/cover.jpg"')
    expect(html).toContain('width="1600" height="800"')
    expect(html).toContain('loading="lazy"')
  })
  it('falls back from a failed cover to the logo, then a neutral frame without retrying failed URLs', () => {
    const props = { title: 'Article', cover: { src: '/cover.jpg', alt: 'Work pictured' }, fallbackImage: { src: '/logo.png', alt: 'Company logo' } }
    render(<BlogCoverImage {...props} />)
    fireEvent.error(screen.getByRole('img', { name: 'Work pictured' }))
    expect(screen.getByRole('img', { name: 'Company logo' })).toHaveAttribute('src', '/logo.png')
    fireEvent.error(screen.getByRole('img', { name: 'Company logo' }))
    expect(screen.getByRole('img', { name: 'No cover image available' })).toHaveTextContent('Image unavailable')
    expect(document.querySelector('img')).toBeNull()
  })
  it.each(['javascript:alert(1)', '//evil.example/image', 'data:image/svg+xml,bad'])('does not request unsafe cover %s', (src) => {
    render(<BlogCoverImage title="Article" cover={{ src, alt: 'Unsafe' }} fallbackImage={{ src: '/logo.png', alt: 'Company logo' }} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/logo.png')
  })
  it('uses the article title for a blank alt and accepts a new cover after an earlier URL failed', () => {
    const { rerender } = render(<BlogCoverImage title="Article" cover={{ src: '/old.jpg', alt: ' ' }} />)
    fireEvent.error(screen.getByRole('img', { name: 'Article' }))
    rerender(<BlogCoverImage title="New article" cover={{ src: '/new.jpg', alt: ' ' }} />)
    expect(screen.getByRole('img', { name: 'New article' })).toHaveAttribute('src', '/new.jpg')
  })
  it('reserves a neutral frame when there is neither a safe cover nor logo', () => {
    render(<BlogCoverImage title="Article" />)
    expect(screen.getByRole('img', { name: 'No cover image available' })).toBeInTheDocument()
    expect(document.querySelector('img')).toBeNull()
  })
})
