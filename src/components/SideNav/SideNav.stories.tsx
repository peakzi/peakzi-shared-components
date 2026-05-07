import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Users,
  Building2,
  ClipboardList,
  Search,
  FileText,
  Link2,
  UserCog,
  Globe,
  Menu,
} from 'lucide-react'
import { SideNav, SideNavGroup, SideNavItem } from './SideNav'
import { TopBar } from '../TopBar'
import { PeakziLogo } from '../PeakziLogo'

const meta: Meta<typeof SideNav> = {
  title: 'Components/App Shell/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Vertical navigation rail for admin app shells. Compose with SideNavGroup and SideNavItem. ' +
          'Use `collapsible` for a desktop collapse toggle (pinned to the bottom of the rail). ' +
          'Use `mobileOpen` + `onMobileClose` to control the mobile drawer.',
      },
    },
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SideNav>

// Shared full nav used across Collapsible, CollapsedTooltips, and AppShell stories
function FullNav() {
  return (
    <>
      <SideNavGroup label="Customers">
        <SideNavItem href="/linked-accounts" icon={<Link2 size={20} strokeWidth={2} />} active>
          Linked Accounts
        </SideNavItem>
        <SideNavItem href="/manage-users" icon={<UserCog size={20} strokeWidth={2} />}>
          Manage Users
        </SideNavItem>
        <SideNavItem href="/ai-website" icon={<Globe size={20} strokeWidth={2} />}>
          AI Website
        </SideNavItem>
        <SideNavItem href="/content-generator" icon={<FileText size={20} strokeWidth={2} />}>
          Content Generator
        </SideNavItem>
      </SideNavGroup>
      <SideNavGroup label="Operations">
        <SideNavItem href="/admin-tasks" icon={<ClipboardList size={20} strokeWidth={2} />}>
          Admin Tasks
        </SideNavItem>
        <SideNavItem href="/talent-search" icon={<Search size={20} strokeWidth={2} />}>
          Talent Search
        </SideNavItem>
        <SideNavItem href="/accounts" icon={<Users size={20} strokeWidth={2} />}>
          Accounts
        </SideNavItem>
        <SideNavItem href="/business" icon={<Building2 size={20} strokeWidth={2} />}>
          Business
        </SideNavItem>
      </SideNavGroup>
    </>
  )
}

// Shared footer block — copyright + version tag, used in collapsible stories
function NavFooter() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 8, minWidth: 0 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>
          © Peakzi
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>Copyright</div>
      </div>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)', flexShrink: 0 }}>
        v3.14.0
      </span>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div style={{ width: 240, height: 600, border: '1px solid #e5e7eb' }}>
      <SideNav>
        <SideNavGroup label="Customers">
          <SideNavItem href="/accounts" active>
            Accounts
          </SideNavItem>
          <SideNavItem href="/business">Business</SideNavItem>
        </SideNavGroup>
        <SideNavGroup label="Operations">
          <SideNavItem href="/admin">Admin Tasks</SideNavItem>
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
        badgeVariant="brand"
      >
        <SideNavGroup label="Customers">
          <SideNavItem href="/linked-accounts" active>
            Linked Accounts
          </SideNavItem>
          <SideNavItem href="/manage-users">Manage Users</SideNavItem>
          <SideNavItem href="/ai-website">AI Website</SideNavItem>
          <SideNavItem href="/content-generator">Content Generator</SideNavItem>
        </SideNavGroup>
        <SideNavGroup label="Operations">
          <SideNavItem href="/admin-tasks">Admin Tasks</SideNavItem>
          <SideNavItem href="/talent-search">Talent Search</SideNavItem>
          <SideNavItem href="/accounts">Accounts</SideNavItem>
          <SideNavItem href="/business">Business</SideNavItem>
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
          <SideNavItem href="/accounts" active>
            Accounts
          </SideNavItem>
          <SideNavItem href="/business">Business</SideNavItem>
        </SideNavGroup>
      </SideNav>
    </div>
  ),
}

export const BadgeVariants: Story = {
  name: 'Brand badge variants',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['brand', 'warning', 'danger', 'success', 'info', 'outline'] as const).map((v) => (
        <div key={v} style={{ width: 200, height: 80, border: '1px solid #e5e7eb' }}>
          <SideNav
            brand={<span style={{ fontWeight: 700, fontSize: 14 }}>peakzi</span>}
            badge={v.toUpperCase()}
            badgeVariant={v}
          />
        </div>
      ))}
    </div>
  ),
}

export const BadgeSizes: Story = {
  name: 'Brand badge sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['sm', 'lg'] as const).map((s) => (
        <div key={s} style={{ width: 200, height: 80, border: '1px solid #e5e7eb' }}>
          <SideNav
            brand={<span style={{ fontWeight: 700, fontSize: 14 }}>peakzi</span>}
            badge={s.toUpperCase()}
            badgeSize={s}
          />
        </div>
      ))}
    </div>
  ),
}

export const WithBadges: Story = {
  name: 'With item badges',
  render: () => (
    <div style={{ width: 240, height: 400, border: '1px solid #e5e7eb' }}>
      <SideNav>
        <SideNavGroup label="Inbox">
          <SideNavItem href="/messages" badge={12}>
            Messages
          </SideNavItem>
          <SideNavItem href="/notifications" badge="New">
            Notifications
          </SideNavItem>
        </SideNavGroup>
      </SideNav>
    </div>
  ),
}

export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <div style={{ width: 240, height: 560, border: '1px solid #e5e7eb' }}>
      <SideNav
        brand={<span style={{ fontWeight: 700 }}>peakzi</span>}
        badge="ADMIN"
        badgeVariant="brand"
      >
        <SideNavGroup label="Customers">
          <SideNavItem href="/linked-accounts" icon={<Link2 size={20} strokeWidth={2} />} active>
            Linked Accounts
          </SideNavItem>
          <SideNavItem href="/manage-users" icon={<UserCog size={20} strokeWidth={2} />}>
            Manage Users
          </SideNavItem>
          <SideNavItem href="/ai-website" icon={<Globe size={20} strokeWidth={2} />}>
            AI Website
          </SideNavItem>
          <SideNavItem href="/content-generator" icon={<FileText size={20} strokeWidth={2} />}>
            Content Generator
          </SideNavItem>
        </SideNavGroup>
        <SideNavGroup label="Operations">
          <SideNavItem href="/admin-tasks" icon={<ClipboardList size={20} strokeWidth={2} />}>
            Admin Tasks
          </SideNavItem>
          <SideNavItem href="/talent-search" icon={<Search size={20} strokeWidth={2} />}>
            Talent Search
          </SideNavItem>
          <SideNavItem href="/accounts" icon={<Users size={20} strokeWidth={2} />}>
            Accounts
          </SideNavItem>
          <SideNavItem href="/business" icon={<Building2 size={20} strokeWidth={2} />}>
            Business
          </SideNavItem>
        </SideNavGroup>
      </SideNav>
    </div>
  ),
}

export const Collapsible: Story = {
  name: 'Collapsible (desktop toggle)',
  render: function CollapsibleStory() {
    const [collapsed, setCollapsed] = useState(false)
    return (
      <div
        style={{
          display: 'flex',
          height: 640,
        }}
      >
        <div
          style={{
            width: collapsed ? 64 : 240,
            border: '1px solid #e5e7eb',
            transition: 'width 220ms cubic-bezier(0.22, 1, 0.36, 1)',
            flexShrink: 0,
            // No overflow — tooltips must escape rightward past the rail boundary
          }}
        >
          <SideNav
            brand={<PeakziLogo variant="auto" size="sm" />}
            brandIcon={<PeakziLogo variant="icon" size="xs" />}
            badge="ADMIN"
            badgeVariant="brand"
            collapsible
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            footer={<NavFooter />}
          >
            <FullNav />
          </SideNav>
        </div>
        <div style={{ flex: 1, padding: 24, color: 'var(--fg-3)', fontSize: 13 }}>
          {collapsed ? 'Hover the icons to see tooltips →' : 'Use the ‹ button at the bottom to collapse'}
        </div>
      </div>
    )
  },
}

export const CollapsedTooltips: Story = {
  name: 'Collapsed — icon tooltips on hover',
  parameters: {
    docs: {
      description: {
        story:
          'When the rail is collapsed to icon-only mode, hovering any nav item reveals its label as a ' +
          'right-side tooltip after a 250 ms delay (fast cursor passes do not trigger it). ' +
          'The tooltip text comes from `data-label`, auto-populated from string children.',
      },
    },
  },
  render: function CollapsedTooltipsStory() {
    const [collapsed, setCollapsed] = useState(true)
    return (
      <div style={{ display: 'flex', height: 560 }}>
        <div
          style={{
            width: collapsed ? 64 : 240,
            border: '1px solid #e5e7eb',
            transition: 'width 220ms cubic-bezier(0.22, 1, 0.36, 1)',
            flexShrink: 0,
            // No overflow restriction — tooltips must escape the rail rightward
          }}
        >
          <SideNav
            brand={<PeakziLogo variant="auto" size="sm" />}
            brandIcon={<PeakziLogo variant="icon" size="xs" />}
            badge="ADMIN"
            badgeVariant="brand"
            collapsible
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            footer={<NavFooter />}
          >
            <FullNav />
          </SideNav>
        </div>
        {/* Content area so tooltips have space to appear over it */}
        <div style={{ flex: 1, padding: 24, color: 'var(--fg-3)', fontSize: 13 }}>
          Hover the icons to see tooltips (250 ms delay) →
        </div>
      </div>
    )
  },
}

export const MobileDrawer: Story = {
  name: 'Mobile drawer',
  parameters: {
    layout: 'fullscreen',
    // Force a mobile viewport so the drawer CSS (max-width: 767px) activates
    viewport: { defaultViewport: 'mobile2' },
  },
  render: function MobileDrawerStory() {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ minHeight: 600, background: '#f5f5f9', position: 'relative' }}>
        {/* Simulated TopBar */}
        <div
          style={{
            height: 56,
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              border: 0,
              borderRadius: 8,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 600 }}>My App</span>
        </div>

        {/* Page content */}
        <div style={{ padding: 24, color: '#52526a', fontSize: 14 }}>
          Click ☰ to open the nav. The X in the drawer header closes it.
        </div>

        {/* SideNav as drawer — X close button appears automatically in brand row */}
        <SideNav
          brand={<span style={{ fontWeight: 700 }}>peakzi</span>}
          badge="ADMIN"
          badgeVariant="brand"
          mobileOpen={open}
          onMobileClose={() => setOpen(false)}
        >
          <SideNavGroup label="Customers">
            <SideNavItem href="/accounts" icon={<Users size={20} strokeWidth={2} />} active>
              Accounts
            </SideNavItem>
            <SideNavItem href="/business" icon={<Building2 size={20} strokeWidth={2} />}>
              Business
            </SideNavItem>
          </SideNavGroup>
          <SideNavGroup label="Operations">
            <SideNavItem href="/admin" icon={<ClipboardList size={20} strokeWidth={2} />}>
              Admin Tasks
            </SideNavItem>
          </SideNavGroup>
        </SideNav>
      </div>
    )
  },
}

// =============================================================================
// Full app shell — wires TopBar + SideNav together in the pz-app grid
// =============================================================================

export const AppShell: Story = {
  name: 'App shell (desktop + mobile)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Full responsive shell. On desktop (≥768 px) the rail is always visible and the hamburger is hidden. ' +
          'Switch to a mobile viewport to see the hamburger appear; tapping it slides the SideNav in as an overlay.',
      },
    },
  },
  render: function AppShellStory() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    return (
      <div
        className={['pz-app', collapsed && 'pz-app--rail-collapsed'].filter(Boolean).join(' ')}
        style={{ minHeight: '100vh' }}
      >
        {/* Rail — hidden from grid on mobile, becomes a fixed overlay via SideNav */}
        <aside className="pz-app__rail">
          <SideNav
            brand={<PeakziLogo variant="auto" size="sm" />}
            brandIcon={<PeakziLogo variant="icon" size="xs" />}
            badgeVariant="brand"
            collapsible
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            mobileOpen={drawerOpen}
            onMobileClose={() => setDrawerOpen(false)}
            footer={<NavFooter />}
          >
            <FullNav />
          </SideNav>
        </aside>

        {/* TopBar — rendered directly into the grid area; hamburger visible on mobile only */}
        <TopBar
          className="pz-app__topbar"
          onMenuClick={() => setDrawerOpen(true)}
          start={<span style={{ fontWeight: 600, fontSize: 15 }}>Dashboard</span>}
        />

        {/* Main content */}
        <main className="pz-app__main">
          <div className="pz-app__main-inner" style={{ color: 'var(--fg-2)', fontSize: 14 }}>
            <p>
              Resize the canvas below 768 px to see the hamburger appear and the rail slide in as a
              drawer.
            </p>
            <p>
              On desktop, use the ‹ button at the bottom of the rail to collapse to icon-only mode.
              Hover icons to see tooltips.
            </p>
          </div>
        </main>
      </div>
    )
  },
}
