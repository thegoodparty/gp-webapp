import { describe, it, expect } from 'vitest'
import { validateRegistrationForm } from './TextingComplianceRegistrationForm'
import type { FormDataState } from '@shared/hooks/useFormData'

const baseValidFormData = (
  overrides: Partial<FormDataState> = {},
): FormDataState => ({
  electionFilingLink: 'https://example.gov/filings/123',
  campaignCommitteeName: 'Jane for Council',
  officeLevel: 'local',
  ein: '12-3456780',
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

  describe('EIN sanity (shared by register + agentic flows)', () => {
    it('rejects an all-same-digit placeholder EIN (00-0000000)', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ ein: '00-0000000' }),
      )
      expect(result.validations.ein).toBe(false)
      expect(result.isValid).toBe(false)
    })

    it('rejects the common 12-3456789 placeholder EIN', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ ein: '12-3456789' }),
      )
      expect(result.validations.ein).toBe(false)
    })

    it('accepts an SSN-looking EIN whose prefix the IRS issues (66-6xxxxxx)', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ ein: '66-6123456' }),
      )
      expect(result.validations.ein).toBe(true)
    })

    it('rejects an EIN with a prefix the IRS does not issue', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ ein: '07-1234567' }),
      )
      expect(result.validations.ein).toBe(false)
    })

    it('accepts a real-shaped EIN with a valid prefix', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ ein: '12-3456780' }),
      )
      expect(result.validations.ein).toBe(true)
    })

    it('rejects in the agentic flow too (requireWebsite: false)', () => {
      const result = validateRegistrationForm(
        baseValidFormData({ ein: '00-0000000' }),
        { requireWebsite: false },
      )
      expect(result.validations.ein).toBe(false)
      expect(result.isValid).toBe(false)
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
