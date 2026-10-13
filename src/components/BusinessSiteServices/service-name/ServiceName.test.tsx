import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServiceName } from './ServiceName'

describe('ServiceName', () => {
  it('supports supplied copy and valid informative photos', () => {
    render(<ServiceName service={{ id: 'one', title: 'Drain cleaning', summary: 'Safe drain cleaning.', image: { src: '/drain.jpg', alt: 'A drain', width: 800, height: 500 } }} headingLevel="h3" />)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Drain cleaning')
    expect(screen.getByRole('img', { name: 'A drain' })).toHaveAttribute('loading', 'lazy')
    expect(screen.getByText('Safe drain cleaning.')).toBeInTheDocument()
  })
  it.each([
    { src: 'javascript:bad', alt: 'Unsafe', width: 800, height: 500 },
    { src: '/drain.jpg', alt: '', width: 800, height: 500 },
    { src: '/drain.jpg', alt: 'Invalid dimensions', width: 0, height: 500 },
  ])('omits unusable photos without removing the service name: %j', (image) => {
    render(<ServiceName service={{ id: 'one', title: 'Drain cleaning', image }} />)
    expect(screen.getByText('Drain cleaning')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
