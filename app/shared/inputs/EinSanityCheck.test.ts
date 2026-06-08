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

  it('does not treat EIN digit sequences as SSN areas (66-6xxxxxx, 9x prefixes pass)', () => {
    // An EIN is XX-XXXXXXX: the first two digits are the IRS campus prefix and
    // the rest are a sequential suffix — there is no SSN "area". So values that
    // merely look SSN-shaped must still pass when the prefix is IRS-issued.
    expect(checkEinSanity('66-6123456')).toEqual({ valid: true }) // prefix 66 is issued; suffix digit 6 is irrelevant
    expect(checkEinSanity('90-1234567')).toEqual({ valid: true }) // 9x prefixes (90-95, 98, 99) are issued
    expect(checkEinSanity('99-1234567')).toEqual({ valid: true })
  })

  it('rejects EINs whose prefix the IRS does not issue', () => {
    // VALID_EIN_PREFIXES is the single authoritative filter for the prefix.
    expect(VALID_EIN_PREFIXES.has('07')).toBe(false)
    expect(VALID_EIN_PREFIXES.has('00')).toBe(false)
    expectFail(checkEinSanity('07-1234567'), 'invalid-prefix')
    expectFail(checkEinSanity('70-1234567'), 'invalid-prefix')
    expectFail(checkEinSanity('00-0123456'), 'invalid-prefix') // prefix 00 not issued (was previously mis-flagged ssn-shaped)
  })
})

describe('einIndicatorState', () => {
  it('returns true for a fully-formed, plausibly-real EIN (green check)', () => {
    expect(einIndicatorState('12-3456780')).toBe(true)
  })

  it('returns false for a fully-formed EIN that fails sanity (red X)', () => {
    expect(einIndicatorState('00-0000000')).toBe(false) // placeholder
    expect(einIndicatorState('12-3456789')).toBe(false) // placeholder
    expect(einIndicatorState('00-0123456')).toBe(false) // invalid prefix (00)
    expect(einIndicatorState('07-1234567')).toBe(false) // invalid prefix
  })

  it('returns null while the EIN is incomplete or wrong-shaped (no error mid-typing)', () => {
    expect(einIndicatorState('')).toBe(null)
    expect(einIndicatorState('12')).toBe(null)
    expect(einIndicatorState('12-345')).toBe(null)
    expect(einIndicatorState('123456789')).toBe(null)
  })
})
