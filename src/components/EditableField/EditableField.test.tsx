import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EditableField } from './EditableField'

describe('EditableField', () => {
  it('displays current value in read mode', () => {
    render(<EditableField value="Beta" onSave={() => {}} />)
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('applies pz-editable-field class', () => {
    const { container } = render(<EditableField value="Beta" onSave={() => {}} />)
    expect(container.querySelector('.pz-editable-field')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<EditableField label="Cohort" value="Beta" onSave={() => {}} />)
    expect(screen.getByText('Cohort')).toBeInTheDocument()
  })

  it('shows edit button in read mode', () => {
    render(<EditableField value="Beta" onSave={() => {}} />)
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('switches to edit mode on edit button click', () => {
    render(<EditableField value="Beta" onSave={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('pre-populates input with current value', () => {
    render(<EditableField value="Beta" onSave={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByRole('textbox')).toHaveValue('Beta')
  })

  it('cancels edit on Cancel button click', () => {
    render(<EditableField value="Beta" onSave={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('calls onSave with new value on Save', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<EditableField value="Beta" onSave={onSave} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Alpha' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(onSave).toHaveBeenCalledWith('Alpha'))
  })

  it('does not call onSave if value unchanged', async () => {
    const onSave = vi.fn()
    render(<EditableField value="Beta" onSave={onSave} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onSave).not.toHaveBeenCalled()
  })

  it('does not show edit button when readOnly=true', () => {
    render(<EditableField value="Beta" onSave={() => {}} readOnly />)
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
  })

  it('shows placeholder when value is empty', () => {
    render(<EditableField value="" onSave={() => {}} placeholder="No value" />)
    expect(screen.getByText('No value')).toBeInTheDocument()
  })

  it('cancels edit on Escape key', () => {
    render(<EditableField value="Beta" onSave={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' })
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('applies stacked layout by default (no inline class)', () => {
    const { container } = render(<EditableField value="Beta" onSave={() => {}} />)
    expect(container.querySelector('.pz-editable-field--inline')).not.toBeInTheDocument()
  })

  it('applies inline class when layout="inline"', () => {
    const { container } = render(<EditableField value="Beta" onSave={() => {}} layout="inline" />)
    expect(container.querySelector('.pz-editable-field--inline')).toBeInTheDocument()
  })

  it('does not apply inline class when layout="stacked"', () => {
    const { container } = render(<EditableField value="Beta" onSave={() => {}} layout="stacked" />)
    expect(container.querySelector('.pz-editable-field--inline')).not.toBeInTheDocument()
  })
})
