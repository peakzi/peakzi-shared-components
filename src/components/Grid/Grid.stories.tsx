import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from './Grid'
import { StatCard } from '../StatCard'
import { Card, CardTitle, CardBody } from '../Card'

const meta: Meta<typeof Grid> = {
  title: 'Components/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Lays out children in columns: equal, auto-flowing, or weighted.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Grid>

export const EqualColumns: Story = {
  name: 'Equal columns',
  render: () => (
    <Grid columns={3} gap="md">
      <StatCard eyebrow="Peakzi Score" value="24.5" footer="12th of 20 similar-size DFW operators" />
      <StatCard eyebrow="Review Rating" value="4.8 stars" footer="14th of 22 your size" />
      <StatCard eyebrow="Market Share" value="3.6%" footer="4th of 20 your size" />
    </Grid>
  ),
}

export const AutoFit: Story = {
  name: 'Auto-fit columns',
  render: () => (
    <Grid columns="auto" minColWidth="200px" gap="sm">
      <StatCard eyebrow="Job demand" value="Sharply up" />
      <StatCard eyebrow="New 1-star reviews" value="2" />
      <StatCard eyebrow="AI site traffic" value="Collecting" />
    </Grid>
  ),
}

export const WeightedColumns: Story = {
  name: 'Weighted split',
  render: () => (
    <Grid columns={[1.4, 1]} gap="lg">
      <Card>
        <CardTitle>Risk — Price perception is your weakest customer score</CardTitle>
        <CardBody>Your Value score ranks 14th of 18 similar-size DFW competitors.</CardBody>
      </Card>
      <Card variant="inset">
        <CardTitle>Why this ranks first</CardTitle>
        <CardBody>Value is the weakest of six customer scores, and the drop is business-specific.</CardBody>
      </Card>
    </Grid>
  ),
}
