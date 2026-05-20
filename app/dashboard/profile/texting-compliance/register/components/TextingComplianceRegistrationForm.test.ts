import { describe, it, expect } from 'vitest'
import { validateRegistrationForm } from './TextingComplianceRegistrationForm'
import type { FormDataState } from '@shared/hooks/useFormData'

const baseValidFormData = (
  overrides: Partial<FormDataState> = {},
): FormDataState => ({
  electionFilingLink: 'https://example.gov/filings/123',
  campaignCommitteeName: 'Jane for Council',
  officeLevel: 'local',
  ein: '12-3456789',
  phone: '5555550123',
  address: { formatted_address: '123 Main St', place_id: 'abc' },
  website: 'https://janeforcouncil.com',
  email: 'jane@example.com',
  ...overrides,
})

describe('validateRegistrationForm', () => {
  describe('default behavior (requireWebsite: true)', () => {
    it('accepts a fully populated form with a valid website', () => {
      const result = validateRegistrationForm(baseValidFormData())
      expect(result.isValid).toBe(true)
      expect(result.validations.website).toBe(true)
    })

    it('rejects when website is empty', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ website: '' }),
      )
      expect(result.isValid).toBe(false)
      expect(result.validations.website).toBe(false)
    })

    it('rejects when website is not a valid URL', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ website: 'not a url' }),
      )
      expect(result.validations.website).toBe(false)
    })
  })

  describe('agentic flow (requireWebsite: false)', () => {
    it('accepts a fully populated form with a valid website', () => {
      const result = validateRegistrationForm(baseValidFormData(), {
        requireWebsite: false,
      })
      expect(result.isValid).toBe(true)
      expect(result.validations.website).toBe(true)
    })

    it('accepts an empty website string', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ website: '' }),
        { requireWebsite: false },
      )
      expect(result.isValid).toBe(true)
      expect(result.validations.website).toBe(true)
    })

    it('still rejects an invalid non-empty website', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ website: 'not a url' }),
        { requireWebsite: false },
      )
      expect(result.isValid).toBe(false)
      expect(result.validations.website).toBe(false)
    })
  })
})
