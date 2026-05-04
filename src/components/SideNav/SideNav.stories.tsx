import type { Meta, StoryObj } from '@storybook/react'
import { SideNav, SideNavGroup, SideNavItem } from './SideNav'

const meta: Meta<typeof SideNav> = {
  title: 'Components/App Shell/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Vertical navigation rail for admin app shells. Compose with SideNavGroup and SideNavItem. The `brand` slot is a flex row with `gap: 8px` — just pass children directly, no wrapper needed.',
      },
    },
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SideNav>

export const Default: Story = {
  render: () => (
    <div style={{ width: 240, height: 600, border: '1px solid #e5e7eb' }}>
      <SideNav>
        <SideNavGroup label="Customers">
          <SideNavItem href="/accounts" active>Accounts</SideNavItem>
          <SideNavItem href="/business">Business</SideNavItem>
        </SideNavGroup>
        <SideNavGroup label="Operations">
          <SideNavItem href="/admin">Admin tasks</SideNavItem>
          <SideNavItem href="/settings">Settings</SideNavItem>
        </SideNavGroup>
      </SideNav>
    </div>
  ),
}

export const WithBrand: Story = {
  name: 'With brand + badge',
  render: () => (
    <div style={{ width: 240, height: 600, border: '1px solid #e5e7eb' }}>
      <SideNav
        brand={<span style={{ fontWeight: 700 }}>peakzi</span>}
        badge="ADMIN"
      >
        <SideNavGroup label="Customers">
          <SideNavItem href="/accounts" active>Accounts</SideNavItem>
          <SideNavItem href="/business">Business</SideNavItem>
          <SideNavItem href="/linked">Linked Accounts</SideNavItem>
          <SideNavItem href="/users">Manage Users</SideNavItem>
        </SideNavGroup>
        <SideNavGroup label="Operations">
          <SideNavItem href="/admin-tasks">Admin Tasks</SideNavItem>
          <SideNavItem href="/talent-search">Talent Search</SideNavItem>
          <SideNavItem href="/ai-website">AI Website</SideNavItem>
          <SideNavItem href="/content-generator">Content Generator</SideNavItem>
        </SideNavGroup>
      </SideNav>
    </div>
  ),
}

export const WithBrandNoBadge: Story = {
  name: 'With brand, no badge',
  render: () => (
    <div style={{ width: 240, height: 400, border: '1px solid #e5e7eb' }}>
      <SideNav brand={<span style={{ fontWeight: 700 }}>peakzi</span>}>
        <SideNavGroup label="Customers">
          <SideNavItem href="/accounts" active>Accounts</SideNavItem>
          <SideNavItem href="/business">Business</SideNavItem>
        </SideNavGroup>
      </SideNav>
    </div>
  ),
}

export const WithBadges: Story = {
  name: 'With item badges',
  render: () => (
    <div style={{ width: 240, height: 400, border: '1px solid #e5e7eb' }}>
      <SideNav>
        <SideNavGroup label="Inbox">
          <SideNavItem href="/messages" badge={12}>Messages</SideNavItem>
          <SideNavItem href="/notifications" badge="New">Notifications</SideNavItem>
        </SideNavGroup>
      </SideNav>
    </div>
  ),
}
