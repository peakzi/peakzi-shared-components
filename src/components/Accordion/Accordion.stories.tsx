import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible accordion using aria-expanded and CSS grid animation. Supports single or multiple items open simultaneously.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Allow single or multiple items open at once',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow closing the open item (single mode only)',
    },
  },
  args: {
    type: 'single',
  },
}

export default meta
type Story = StoryObj<typeof Accordion>

const items = [
  {
    id: 'ai-citations',
    title: 'What are AI citations?',
    content:
      'AI citations are references to your business in AI-generated search results, chatbot answers, and summarisation tools like ChatGPT, Perplexity, and Google AI Overview.',
  },
  {
    id: 'score',
    title: 'How is my score calculated?',
    content:
      'Your score is based on profile completeness, review quality and recency, structured data markup, and how frequently your business appears in AI answers across monitored queries.',
  },
  {
    id: 'improve',
    title: 'How do I improve my score?',
    content:
      'Complete your business profile, respond to reviews, add structured data (JSON-LD) to your website, and publish fresh content regularly. We surface specific gaps in the Recommendations tab.',
  },
]

/** Interactive playground — toggle `type` via the Controls panel. */
export const Default: Story = {
  render: (args) => (
    <Accordion {...args} defaultValue="ai-citations" style={{ maxWidth: 560 }}>
      {items.map((item) => (
        <AccordionItem key={item.id} id={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const MultipleOpen: Story = {
  name: 'Multiple open',
  render: () => (
    <Accordion type="multiple" defaultValue={['ai-citations', 'score']} style={{ maxWidth: 560 }}>
      {items.map((item) => (
        <AccordionItem key={item.id} id={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const AllClosed: Story = {
  name: 'All closed (default)',
  render: () => (
    <Accordion style={{ maxWidth: 560 }}>
      {items.map((item) => (
        <AccordionItem key={item.id} id={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}
