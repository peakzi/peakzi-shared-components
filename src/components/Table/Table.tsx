import { type ReactNode, type TableHTMLAttributes, type HTMLAttributes, type ThHTMLAttributes } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

// ---------------------------------------------------------------------------
// Table wrapper
// ---------------------------------------------------------------------------

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Adds alternating row background */
  striped?: boolean
  children?: ReactNode
}

export function Table({ striped, className, children, ...rest }: TableProps) {
  return (
    <div className="pz-table-wrap">
      <table
        className={['pz-table', striped && 'pz-table--striped', className]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </table>
    </div>
  )
}
Table.displayName = 'Table'

// ---------------------------------------------------------------------------
// Thead / Tbody / Tfoot
// ---------------------------------------------------------------------------

export function Thead({ children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...rest}>{children}</thead>
}
Thead.displayName = 'Thead'

export function Tbody({ children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...rest}>{children}</tbody>
}
Tbody.displayName = 'Tbody'

export function Tr({ children, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...rest}>{children}</tr>
}
Tr.displayName = 'Tr'

// ---------------------------------------------------------------------------
// Sortable Th
// ---------------------------------------------------------------------------

export type SortDirection = 'asc' | 'desc' | 'none'

export interface ThProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** When provided, renders a sortable column header */
  sortDirection?: SortDirection
  /** Called when the sort button is clicked */
  onSort?: () => void
  children?: ReactNode
}

export function Th({ sortDirection, onSort, className, children, ...rest }: ThProps) {
  if (sortDirection !== undefined && onSort) {
    const Icon =
      sortDirection === 'asc'
        ? ChevronUp
        : sortDirection === 'desc'
          ? ChevronDown
          : ChevronsUpDown

    return (
      <th
        className={['pz-table__sortable-header', className].filter(Boolean).join(' ')}
        aria-sort={
          sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
              ? 'descending'
              : 'none'
        }
        {...rest}
      >
        <button type="button" className="pz-table__sortable" onClick={onSort}>
          {children}
          <Icon size={12} aria-hidden />
        </button>
      </th>
    )
  }

  return (
    <th className={className} {...rest}>
      {children}
    </th>
  )
}
Th.displayName = 'Th'

// ---------------------------------------------------------------------------
// Td
// ---------------------------------------------------------------------------

export interface TdProps extends HTMLAttributes<HTMLTableCellElement> {
  /** Applies monospace numeric alignment */
  numeric?: boolean
  children?: ReactNode
}

export function Td({ numeric, className, children, ...rest }: TdProps) {
  return (
    <td
      className={[numeric && 'num', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </td>
  )
}
Td.displayName = 'Td'
