import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ManualOfficeEntryStep } from './ManualOfficeEntryStep'
import type { ManualOfficeForm } from './onboardingTypes'

const baseValue: ManualOfficeForm = {
  office: '',
  state: '',
  city: '',
  district: '',
  officeTermLength: '',
  electionDate: '',
}

const renderStep = (overrides: Partial<ManualOfficeForm> = {}) => {
  const onChange = vi.fn()
  const value = { ...baseValue, ...overrides }
  return {
    onChange,
    value,
    ...render(<ManualOfficeEntryStep value={value} onChange={onChange} />),
  }
}

describe('ManualOfficeEntryStep', () => {
  it('renders the labels for every required field', () => {
    renderStep()
    expect(screen.getAllByText('Office Name').length).toBeGreaterThan(0)
    expect(screen.getAllByText('State').length).toBeGreaterThan(0)
    expect(screen.getAllByText('City, Town Or County').length).toBeGreaterThan(
      0,
    )
    expect(
      screen.getAllByText('District (If Applicable)').length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByText('Term Length').length).toBeGreaterThan(0)
    expect(screen.getAllByText('General Election Date').length).toBeGreaterThan(
      0,
    )
  })

  it('emits onChange with the merged form when the office name is updated', () => {
    const { onChange } = renderStep()
    const officeInput = screen.getByLabelText(/office name/i)
    fireEvent.change(officeInput, { target: { value: 'City Council' } })
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ office: 'City Council', state: '' }),
    )
  })

  it('emits onChange when the state select changes', () => {
    const { onChange } = renderStep()
    fireEvent.click(screen.getByRole('combobox', { name: /state/i }))
    fireEvent.click(screen.getByRole('option', { name: 'NC' }))
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ state: 'NC' }),
    )
  })

  it('flags past election dates as invalid', () => {
    renderStep({ electionDate: '2000-01-01' })
    expect(
      screen.getByText(/election date cannot be in the past/i),
    ).toBeInTheDocument()
  })

  it('does not flag future election dates as invalid', () => {
    renderStep({ electionDate: '2099-01-01' })
    expect(
      screen.queryByText(/election date cannot be in the past/i),
    ).not.toBeInTheDocument()
  })

  it('passes the current value through to controlled inputs', () => {
    renderStep({ office: 'Mayor', district: '7' })
    expect(screen.getByDisplayValue('Mayor')).toBeInTheDocument()
    expect(screen.getByDisplayValue('7')).toBeInTheDocument()
  })
})
