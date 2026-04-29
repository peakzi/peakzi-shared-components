import type { Meta, StoryObj } from '@storybook/react'
import { Navbar, NavBrand, NavLinks, NavLink, NavActions } from './Navbar'
import { Button } from '../Button'

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Responsive navigation bar. NavLink renders `<a href>` elements for crawler discoverability. Hidden below 720px via CSS.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Navbar>

export const Default: Story = {
  render: () => (
    <Navbar>
      <NavBrand href="/">Peakzi</NavBrand>
      <NavLinks>
        <NavLink href="/dashboard" active>Dashboard</NavLink>
        <NavLink href="/analytics">Analytics</NavLink>
        <NavLink href="/reports">Reports</NavLink>
        <NavLink href="/settings">Settings</NavLink>
      </NavLinks>
      <NavActions>
        <Button variant="ghost" size="sm">Sign in</Button>
        <Button variant="gradient" size="sm">Get started</Button>
      </NavActions>
    </Navbar>
  ),
}

export const WithLogo: Story = {
  name: 'With logo image',
  render: () => (
    <Navbar>
      <NavBrand href="/" logo={<img src="/assets/icon.svg" alt="" aria-hidden="true" />}>
        Peakzi
      </NavBrand>
      <NavLinks>
        <NavLink href="/dashboard" active>Dashboard</NavLink>
        <NavLink href="/analytics">Analytics</NavLink>
      </NavLinks>
      <NavActions>
        <Button variant="gradient" size="sm">Get started</Button>
      </NavActions>
    </Navbar>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Navbar>
      <NavBrand href="/">Peakzi</NavBrand>
      <NavActions>
        <Button variant="ghost" size="sm">Sign in</Button>
        <Button size="sm">Sign up</Button>
      </NavActions>
    </Navbar>
  ),
}
