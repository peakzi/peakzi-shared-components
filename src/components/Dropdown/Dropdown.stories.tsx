import type { Meta, StoryObj } from '@storybook/react'
import { Settings, User, LogOut, Trash2, ChevronDown } from 'lucide-react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from './Dropdown'

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Overlays/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Composable dropdown with ARIA roles (menu/menuitem). Closes on outside click, Escape key, or item selection.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
  render: () => (
    <div style={{ height: 220 }}>
      <Dropdown>
        <DropdownTrigger
          className="pz-btn pz-btn--secondary pz-btn--sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          Options <ChevronDown size={14} />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownLabel>Account</DropdownLabel>
          <DropdownItem icon={<User size={14} />}>Profile</DropdownItem>
          <DropdownItem icon={<Settings size={14} />}>Settings</DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon={<LogOut size={14} />}>Sign out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
}

export const WithDangerItem: Story = {
  name: 'With danger item',
  render: () => (
    <div style={{ height: 200 }}>
      <Dropdown>
        <DropdownTrigger className="pz-btn pz-btn--secondary pz-btn--sm">
          Actions <ChevronDown size={14} />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem icon={<Settings size={14} />}>Edit</DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon={<Trash2 size={14} />} danger>
            Delete listing
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
}

export const RightAligned: Story = {
  name: 'Right-aligned menu',
  render: () => (
    <div style={{ height: 180, display: 'flex', justifyContent: 'flex-end' }}>
      <Dropdown>
        <DropdownTrigger className="pz-btn pz-btn--secondary pz-btn--sm">
          Menu <ChevronDown size={14} />
        </DropdownTrigger>
        <DropdownMenu align="right">
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
}
