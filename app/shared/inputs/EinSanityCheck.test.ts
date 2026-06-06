import { describe, it, expect } from 'vitest'
import {
  checkEinSanity,
  einIndicatorState,
  VALID_EIN_PREFIXES,
  type EinSanityResult,
} from '@shared/inputs/EinSanityCheck'

const expectFail = (
  result: EinSanityResult,
  reason: Exclude<EinSanityResult, { valid: true }>['reason'],
) => {
  expect(result.valid).toBe(false)
  // narrow for the type checker
  if (result.valid) throw new Error('expected a failure result')
  expect(result.reason).toBe(reason)
  expect(result.message.length).toBeGreaterThan(0)
}

describe('checkEinSanity', () => {
  it('passes a well-formed, plausibly-real EIN', () => {
    // prefix 12 is IRS-issued; not a placeholder, all-same, or SSN-shaped value
    expect(checkEinSanity('12-3456780')).toEqual({ valid: true })
  })

  it('rejects a value that does not match XX-XXXXXXX shape', () => {
    expectFail(checkEinSanity('123456789'), 'format')
    expectFail(checkEinSanity('1-23456789'), 'format')
    expectFail(checkEinSanity(''), 'format')
  })

  it('rejects the common 12-3456789 placeholder', () => {
    expectFail(checkEinSanity('12-3456789'), 'placeholder')
  })

  it('rejects all-same-digit values', () => {
    expectFail(checkEinSanity('11-1111111'), 'placeholder')
    expectFail(checkEinSanity('00-0000000'), 'placeholder')
  })

  it('rejects SSN-shaped values (first three digits 000, 666, or 900-999)', () => {
    expectFail(checkEinSanity('00-0123456'), 'ssn-shaped') // 000...
    expectFail(checkEinSanity('66-6123456'), 'ssn-shaped') // 666... (66 is a valid prefix, so SSN rule must win)
    expectFail(checkEinSanity('90-0123456'), 'ssn-shaped') // 900... (90 is a valid prefix, so SSN rule must win)
    expectFail(checkEinSanity('99-9123456'), 'ssn-shaped') // 999...
  })

  it('rejects EINs whose prefix the IRS does not issue', () => {
    // 07 is not in the IRS-issued set; digits are not SSN-shaped
    expect(VALID_EIN_PREFIXES.has('07')).toBe(false)
    expectFail(checkEinSanity('07-1234567'), 'invalid-prefix')
    expectFail(checkEinSanity('70-1234567'), 'invalid-prefix')
  })
})

describe('einIndicatorState', () => {
  it('returns true for a fully-formed, plausibly-real EIN (green check)', () => {
    expect(einIndicatorState('12-3456780')).toBe(true)
  })

  it('returns false for a fully-formed EIN that fails sanity (red X)', () => {
    expect(einIndicatorState('00-0000000')).toBe(false) // placeholder
    expect(einIndicatorState('12-3456789')).toBe(false) // placeholder
    expect(einIndicatorState('00-0123456')).toBe(false) // ssn-shaped
    expect(einIndicatorState('07-1234567')).toBe(false) // invalid prefix
  })

  it('returns null while the EIN is incomplete or wrong-shaped (no error mid-typing)', () => {
    expect(einIndicatorState('')).toBe(null)
    expect(einIndicatorState('12')).toBe(null)
    expect(einIndicatorState('12-345')).toBe(null)
    expect(einIndicatorState('123456789')).toBe(null)
  })
})
