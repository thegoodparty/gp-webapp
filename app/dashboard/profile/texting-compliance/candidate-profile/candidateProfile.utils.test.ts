import { describe, it, expect } from 'vitest'
import {
  MIN_BIO_LENGTH,
  MIN_POLICY_FOCUS_LENGTH,
  getBioError,
  getPolicyPrioritiesError,
  getPolicyFormValidation,
} from './candidateProfile.utils'

describe('getBioError', () => {
  it('asks the user to add a bio when it is empty', () => {
    expect(getBioError(0)).toBe('Please add your bio')
  })

  it('reports the character requirement when the bio is too short', () => {
    expect(getBioError(MIN_BIO_LENGTH - 1)).toBe(
      `Your bio requires ${MIN_BIO_LENGTH} characters`,
    )
  })

  it('returns null once the bio meets the minimum length', () => {
    expect(getBioError(MIN_BIO_LENGTH)).toBeNull()
  })
})

describe('getPolicyPrioritiesError', () => {
  it('asks for at least one priority when there are none', () => {
    expect(getPolicyPrioritiesError(0)).toBe(
      'Please add at least one policy priority',
    )
  })

  it('returns null once at least one priority exists', () => {
    expect(getPolicyPrioritiesError(1)).toBeNull()
  })
})

describe('getPolicyFormValidation', () => {
  it('asks to add both fields when both are empty (matches Figma)', () => {
    const result = getPolicyFormValidation(0, 0)
    expect(result.message).toBe('Please add a Policy title and Policy focus')
    expect(result.titleInvalid).toBe(true)
    expect(result.focusInvalid).toBe(true)
  })

  it('reports the focus length requirement when the title is set but focus is too short (matches Figma)', () => {
    const result = getPolicyFormValidation(
      'Education'.length,
      MIN_POLICY_FOCUS_LENGTH - 1,
    )
    expect(result.message).toBe(
      `Policy focus requires ${MIN_POLICY_FOCUS_LENGTH} characters`,
    )
    expect(result.titleInvalid).toBe(false)
    expect(result.focusInvalid).toBe(true)
  })

  it('asks to add the title alone when only the title is missing', () => {
    const result = getPolicyFormValidation(0, MIN_POLICY_FOCUS_LENGTH)
    expect(result.message).toBe('Please add a Policy title')
    expect(result.titleInvalid).toBe(true)
    expect(result.focusInvalid).toBe(false)
  })

  it('asks to add the focus alone when only the focus is empty', () => {
    const result = getPolicyFormValidation(5, 0)
    expect(result.message).toBe('Please add a Policy focus')
    expect(result.titleInvalid).toBe(false)
    expect(result.focusInvalid).toBe(true)
  })

  it('returns no message when both fields satisfy their requirements', () => {
    const result = getPolicyFormValidation(5, MIN_POLICY_FOCUS_LENGTH)
    expect(result.message).toBeNull()
    expect(result.titleInvalid).toBe(false)
    expect(result.focusInvalid).toBe(false)
  })
})
