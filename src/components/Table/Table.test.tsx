import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Table, Thead, Tbody, Tr, Th, Td } from './Table'

function BasicTable() {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Score</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Jordan</Td>
          <Td numeric>91</Td>
        </Tr>
      </Tbody>
    </Table>
  )
}

describe('Table', () => {
  it('renders a table element', () => {
    render(<BasicTable />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('wraps in pz-table-wrap container', () => {
    const { container } = render(<BasicTable />)
    expect(container.querySelector('.pz-table-wrap')).toBeInTheDocument()
  })

  it('applies pz-table class', () => {
    render(<BasicTable />)
    expect(screen.getByRole('table')).toHaveClass('pz-table')
  })

  it('applies striped class when striped prop set', () => {
    render(
      <Table striped>
        <Tbody><Tr><Td>Cell</Td></Tr></Tbody>
      </Table>,
    )
    expect(screen.getByRole('table')).toHaveClass('pz-table--striped')
  })

  it('renders column headers', () => {
    render(<BasicTable />)
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Score' })).toBeInTheDocument()
  })

  it('renders cell data', () => {
    render(<BasicTable />)
    expect(screen.getByRole('cell', { name: 'Jordan' })).toBeInTheDocument()
  })

  it('applies num class to numeric Td', () => {
    const { container } = render(
      <Table>
        <Tbody><Tr><Td numeric>91</Td></Tr></Tbody>
      </Table>,
    )
    expect(container.querySelector('td.num')).toBeInTheDocument()
  })
})

describe('Th (sortable)', () => {
  it('renders sort button when sortDirection and onSort are provided', () => {
    render(
      <table>
        <thead>
          <Tr>
            <Th sortDirection="none" onSort={() => {}}>Name</Th>
          </Tr>
        </thead>
      </table>,
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onSort when sort button is clicked', () => {
    const onSort = vi.fn()
    render(
      <table>
        <thead>
          <Tr>
            <Th sortDirection="none" onSort={onSort}>Name</Th>
          </Tr>
        </thead>
      </table>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onSort).toHaveBeenCalledTimes(1)
  })

  it('sets aria-sort="ascending" when sortDirection is asc', () => {
    render(
      <table>
        <thead>
          <Tr>
            <Th sortDirection="asc" onSort={() => {}}>Name</Th>
          </Tr>
        </thead>
      </table>,
    )
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending')
  })

  it('sets aria-sort="descending" when sortDirection is desc', () => {
    render(
      <table>
        <thead>
          <Tr>
            <Th sortDirection="desc" onSort={() => {}}>Name</Th>
          </Tr>
        </thead>
      </table>,
    )
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending')
  })

  it('does not render sort button when no sortDirection', () => {
    render(
      <table>
        <thead>
          <Tr>
            <Th>Name</Th>
          </Tr>
        </thead>
      </table>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
