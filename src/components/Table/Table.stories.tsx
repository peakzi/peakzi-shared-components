import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from './Table'
import type { SortDirection } from './Table'
import { Badge } from '../Badge'

const meta: Meta<typeof Table> = {
  title: 'Components/Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Semantic HTML table with optional striped rows and sortable column headers. Wraps in a scrollable container to prevent layout overflow.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Table>

const rows = [
  { name: 'Jordan Reyes', role: 'Contractor', score: 91, status: 'active' },
  { name: 'Ana Ruiz', role: 'Technician', score: 78, status: 'active' },
  { name: 'Marcus Webb', role: 'Homeowner', score: 62, status: 'pending' },
  { name: 'Sarah Kim', role: 'Contractor', score: 84, status: 'active' },
  { name: 'Leon Torres', role: 'Technician', score: 55, status: 'offline' },
]

export const Default: Story = {
  render: () => (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Role</Th>
          <Th>Status</Th>
          <Th>Score</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((r) => (
          <Tr key={r.name}>
            <Td>{r.name}</Td>
            <Td>{r.role}</Td>
            <Td>
              <Badge variant={r.status === 'active' ? 'success' : r.status === 'pending' ? 'warning' : 'neutral'} dot>
                {r.status}
              </Badge>
            </Td>
            <Td numeric>{r.score}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  ),
}

export const Striped: Story = {
  render: () => (
    <Table striped>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Role</Th>
          <Th>Score</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((r) => (
          <Tr key={r.name}>
            <Td>{r.name}</Td>
            <Td>{r.role}</Td>
            <Td numeric>{r.score}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  ),
}

export const Sortable: Story = {
  render: function SortableStory() {
    const [sortKey, setSortKey] = useState<'name' | 'score' | null>(null)
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

    const getDir = (key: string): SortDirection => {
      if (sortKey !== key) return 'none'
      return sortDir
    }

    const handleSort = (key: 'name' | 'score') => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDir('asc')
      }
    }

    const sorted = [...rows].sort((a, b) => {
      if (!sortKey) return 0
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'score') return (a.score - b.score) * mul
      return a.name.localeCompare(b.name) * mul
    })

    return (
      <Table>
        <Thead>
          <Tr>
            <Th sortDirection={getDir('name')} onSort={() => handleSort('name')}>Name</Th>
            <Th>Role</Th>
            <Th sortDirection={getDir('score')} onSort={() => handleSort('score')}>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sorted.map((r) => (
            <Tr key={r.name}>
              <Td>{r.name}</Td>
              <Td>{r.role}</Td>
              <Td numeric>{r.score}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  },
}
