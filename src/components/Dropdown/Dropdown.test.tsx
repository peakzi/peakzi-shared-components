import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from './Dropdown'

function BasicDropdown({ onItemClick = () => {} }: { onItemClick?: () => void } = {}) {
  return (
    <Dropdown>
      <DropdownTrigger>Open</DropdownTrigger>
      <DropdownMenu>
        <DropdownLabel>Section</DropdownLabel>
        <DropdownItem onClick={onItemClick}>Item 1</DropdownItem>
        <DropdownItem>Item 2</DropdownItem>
        <DropdownSeparator />
        <DropdownItem danger>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

describe('Dropdown', () => {
  it('renders trigger button', () => {
    render(<BasicDropdown />)
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('menu is closed by default (not visible)', () => {
    render(<BasicDropdown />)
    const menu = screen.getByRole('menu', { hidden: true })
    expect(menu).not.toHaveClass('is-open')
  })

  it('opens menu when trigger is clicked', () => {
    render(<BasicDropdown />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('menu')).toHaveClass('is-open')
  })

  it('closes menu when trigger is clicked again', () => {
    render(<BasicDropdown />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('is-open')
  })

  it('sets aria-expanded on trigger', () => {
    render(<BasicDropdown />)
    const trigger = screen.getByRole('button', { name: 'Open' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('trigger has aria-haspopup="menu"', () => {
    render(<BasicDropdown />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('renders menu items', () => {
    render(<BasicDropdown />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('menuitem', { name: 'Item 1' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Item 2' })).toBeInTheDocument()
  })

  it('calls item onClick and closes menu', () => {
    const onItemClick = vi.fn()
    render(<BasicDropdown onItemClick={onItemClick} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Item 1' }))
    expect(onItemClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('is-open')
  })

  it('closes when Escape is pressed', () => {
    render(<BasicDropdown />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('is-open')
  })

  it('closes when clicking outside', () => {
    render(
      <>
        <button type="button">Outside</button>
        <BasicDropdown />
      </>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('is-open')
  })

  it('hides the menu from normal accessibility queries while closed', () => {
    render(<BasicDropdown />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('hidden')
  })

  it('applies danger class to danger item', () => {
    render(<BasicDropdown />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('pz-dropdown__item--danger')
  })

  it('renders separator', () => {
    const { container } = render(<BasicDropdown />)
    expect(container.querySelector('.pz-dropdown__sep')).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<BasicDropdown />)
    expect(screen.getByText('Section')).toBeInTheDocument()
  })
})
