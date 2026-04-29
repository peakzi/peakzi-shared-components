import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabList, Tab, TabPanel } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible tabs using ARIA roles (tablist/tab/tabpanel). Three visual variants: underline, pill, and boxed.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['underline', 'pill', 'boxed'],
      description: 'Visual style of the tab bar',
    },
    defaultTab: { control: 'text', description: 'ID of the tab open by default' },
  },
  args: {
    variant: 'underline',
    defaultTab: 'overview',
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

function TabContent({ label }: { label: string }) {
  return (
    <p>
      Content for the <strong>{label}</strong> tab.
    </p>
  )
}

/** Interactive playground — switch variant via the Controls panel. */
export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab tabId="overview">Overview</Tab>
        <Tab tabId="analytics">Analytics</Tab>
        <Tab tabId="reports">Reports</Tab>
      </TabList>
      <TabPanel tabId="overview"><TabContent label="Overview" /></TabPanel>
      <TabPanel tabId="analytics"><TabContent label="Analytics" /></TabPanel>
      <TabPanel tabId="reports"><TabContent label="Reports" /></TabPanel>
    </Tabs>
  ),
}

export const Underline: Story = {
  render: () => (
    <Tabs defaultTab="overview" variant="underline">
      <TabList>
        <Tab tabId="overview">Overview</Tab>
        <Tab tabId="analytics">Analytics</Tab>
        <Tab tabId="reports">Reports</Tab>
      </TabList>
      <TabPanel tabId="overview"><TabContent label="Overview" /></TabPanel>
      <TabPanel tabId="analytics"><TabContent label="Analytics" /></TabPanel>
      <TabPanel tabId="reports"><TabContent label="Reports" /></TabPanel>
    </Tabs>
  ),
}

export const Pill: Story = {
  render: () => (
    <Tabs defaultTab="overview" variant="pill">
      <TabList>
        <Tab tabId="overview">Overview</Tab>
        <Tab tabId="analytics">Analytics</Tab>
        <Tab tabId="reports">Reports</Tab>
      </TabList>
      <TabPanel tabId="overview"><TabContent label="Overview" /></TabPanel>
      <TabPanel tabId="analytics"><TabContent label="Analytics" /></TabPanel>
      <TabPanel tabId="reports"><TabContent label="Reports" /></TabPanel>
    </Tabs>
  ),
}

export const Boxed: Story = {
  render: () => (
    <Tabs defaultTab="overview" variant="boxed">
      <TabList>
        <Tab tabId="overview">Overview</Tab>
        <Tab tabId="analytics">Analytics</Tab>
        <Tab tabId="reports">Reports</Tab>
      </TabList>
      <TabPanel tabId="overview"><TabContent label="Overview" /></TabPanel>
      <TabPanel tabId="analytics"><TabContent label="Analytics" /></TabPanel>
      <TabPanel tabId="reports"><TabContent label="Reports" /></TabPanel>
    </Tabs>
  ),
}

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['underline', 'pill', 'boxed'] as const).map((v) => (
        <div key={v}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{v}</p>
          <Tabs defaultTab="tab1" variant={v}>
            <TabList>
              <Tab tabId="tab1">Tab one</Tab>
              <Tab tabId="tab2">Tab two</Tab>
              <Tab tabId="tab3">Tab three</Tab>
            </TabList>
            <TabPanel tabId="tab1"><TabContent label="Tab one" /></TabPanel>
            <TabPanel tabId="tab2"><TabContent label="Tab two" /></TabPanel>
            <TabPanel tabId="tab3"><TabContent label="Tab three" /></TabPanel>
          </Tabs>
        </div>
      ))}
    </div>
  ),
}
