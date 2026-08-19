import type { Meta, StoryObj } from '@storybook/react'
import { CodeSnippet } from './CodeSnippet'

const meta: Meta<typeof CodeSnippet> = {
  title: 'Components/Data Display/CodeSnippet',
  component: CodeSnippet,
  tags: ['autodocs'],
  args: {
    label: 'Request body',
    language: 'json',
    code: '{\n  "accountId": "account_123",\n  "active": true\n}',
  },
}

export default meta
type Story = StoryObj<typeof CodeSnippet>

export const Default: Story = {}

export const Endpoint: Story = {
  args: {
    label: 'Endpoint',
    language: 'POST',
    code: 'https://api.peakzi.me/api/v1/business/load',
  },
}

export const Wrapped: Story = {
  args: {
    label: 'Long response',
    language: 'json',
    wrap: true,
    maxHeight: 220,
    code: '{\n  "description": "A long response value that wraps instead of forcing the surrounding page to overflow horizontally."\n}',
  },
}
