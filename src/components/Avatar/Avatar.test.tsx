import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarStack } from './Avatar'

describe('Avatar', () => {
  it('renders initials when no src', () => {
    render(<Avatar initials="JR" alt="Jordan Reyes" />)
    expect(screen.getByText('JR')).toBeInTheDocument()
  })

  it('renders image when src is provided', () => {
    render(<Avatar src="/avatar.jpg" alt="Jordan Reyes" />)
    expect(screen.getByRole('img', { name: 'Jordan Reyes' })).toBeInTheDocument()
  })

  it('applies pz-avatar base class', () => {
    const { container } = render(<Avatar initials="JR" />)
    expect(container.querySelector('.pz-avatar')).toBeInTheDocument()
  })

  it('applies size class', () => {
    const { container } = render(<Avatar size="lg" initials="JR" />)
    expect(container.querySelector('.pz-avatar--lg')).toBeInTheDocument()
  })

  it('applies md size class when size="md" is explicitly passed', () => {
    const { container } = render(<Avatar size="md" initials="JR" />)
    expect(container.querySelector('.pz-avatar--md')).toBeInTheDocument()
  })

  it('applies gradient variant class', () => {
    const { container } = render(<Avatar variant="gradient" initials="JR" />)
    expect(container.querySelector('.pz-avatar--gradient')).toBeInTheDocument()
  })

  it('applies ring class', () => {
    const { container } = render(<Avatar ring initials="JR" />)
    expect(container.querySelector('.pz-avatar--ring')).toBeInTheDocument()
  })

  it('renders status dot when status provided', () => {
    const { container } = render(<Avatar initials="JR" status="online" />)
    expect(container.querySelector('.pz-avatar__status')).toBeInTheDocument()
  })

  it('does not render status dot when no status', () => {
    const { container } = render(<Avatar initials="JR" />)
    expect(container.querySelector('.pz-avatar__status')).not.toBeInTheDocument()
  })

  it('applies away status class', () => {
    const { container } = render(<Avatar initials="JR" status="away" />)
    expect(container.querySelector('.pz-avatar__status--away')).toBeInTheDocument()
  })

  it('applies busy status class', () => {
    const { container } = render(<Avatar initials="JR" status="busy" />)
    expect(container.querySelector('.pz-avatar__status--busy')).toBeInTheDocument()
  })

  it('applies offline status class', () => {
    const { container } = render(<Avatar initials="JR" status="offline" />)
    expect(container.querySelector('.pz-avatar__status--offline')).toBeInTheDocument()
  })

  it('status dot has accessible label', () => {
    render(<Avatar initials="JR" status="online" />)
    expect(screen.getByLabelText('Status: online')).toBeInTheDocument()
  })
})

describe('AvatarStack', () => {
  it('applies pz-avatar-stack class', () => {
    const { container } = render(
      <AvatarStack>
        <Avatar initials="JR" />
        <Avatar initials="AR" />
      </AvatarStack>,
    )
    expect(container.querySelector('.pz-avatar-stack')).toBeInTheDocument()
  })

  it('renders children avatars', () => {
    render(
      <AvatarStack>
        <Avatar initials="JR" />
        <Avatar initials="AR" />
      </AvatarStack>,
    )
    expect(screen.getByText('JR')).toBeInTheDocument()
    expect(screen.getByText('AR')).toBeInTheDocument()
  })
})
