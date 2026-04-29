import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'

const meta: Meta<typeof Modal> = {
  title: 'Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible dialog rendered in a portal. Traps focus, closes on Escape or backdrop click, and sets aria-modal.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm action"
          description="This cannot be undone."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
            </>
          }
        >
          Are you sure you want to delete this listing? It will be removed from all AI citations and
          your analytics history.
        </Modal>
      </>
    )
  },
}

export const Large: Story = {
  render: function LargeStory() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open large modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Edit business profile"
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="gradient" onClick={() => setOpen(false)}>Save changes</Button>
            </>
          }
        >
          <p>
            Detailed form content goes here. This modal uses the <code>lg</code> size (max-width
            720px).
          </p>
        </Modal>
      </>
    )
  },
}
