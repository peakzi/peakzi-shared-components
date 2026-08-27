import type { Meta, StoryObj } from '@storybook/react'
import { Section, SectionHeader } from './Section'
import { Grid } from '../Grid'
import { StatCard } from '../StatCard'

const meta: Meta<typeof Section> = {
  title: 'Components/Layout/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'One labeled region of a page: a heading (via SectionHeader) followed by its content.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Section>

export const Default: Story = {
  render: () => (
    <Section>
      <SectionHeader title="Standing" lead="Read 10 Aug, next 7 Sep." />
      <Grid columns={3}>
        <StatCard eyebrow="Peakzi Score" value="24.5" footer="12th of 20 similar-size DFW operators" />
        <StatCard eyebrow="Review Rating" value="4.8 stars" footer="14th of 22 your size" />
        <StatCard eyebrow="Market Share" value="3.6%" footer="4th of 20 your size" />
      </Grid>
    </Section>
  ),
}

export const HeadingLevel: Story = {
  name: 'h2 heading',
  render: () => (
    <Section>
      <SectionHeader title="Do this week" as="h2" />
      <Grid columns={2}>
        <StatCard eyebrow="Job demand" value="Sharply up" />
        <StatCard eyebrow="New 1-star reviews" value="2" />
      </Grid>
    </Section>
  ),
}
