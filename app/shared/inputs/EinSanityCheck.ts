import { EIN_PATTERN_FULL, isValidEIN } from '@shared/inputs/IsValidEIN'

/**
 * Valid two-digit EIN prefixes (the campus / online assignment codes the IRS
 * actually issues). Anything outside this set cannot be a real EIN.
 *
 * Source: IRS, "How EINs are assigned and valid EIN prefixes"
 * https://www.irs.gov/businesses/small-businesses-self-employed/how-eins-are-assigned-and-valid-ein-prefixes
 *
 * Keep this list identical to any server-side copy (a future gp-api EIN schema)
 * so the client and server sanity layers agree.
 */
export const VALID_EIN_PREFIXES: ReadonlySet<string> = new Set([
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
  '59',
  '60',
  '61',
  '62',
  '63',
  '64',
  '65',
  '66',
  '67',
  '68',
  '71',
  '72',
  '73',
  '74',
  '75',
  '76',
  '77',
  '80',
  '81',
  '82',
  '83',
  '84',
  '85',
  '86',
  '87',
  '88',
  '90',
  '91',
  '92',
  '93',
  '94',
  '95',
  '98',
  '99',
])

export type EinSanityFailureReason =
  | 'format'
  | 'placeholder'
  | 'ssn-shaped'
  | 'invalid-prefix'

export type EinSanityResult =
  | { valid: true }
  | { valid: false; reason: EinSanityFailureReason; message: string }

const FAILURE_MESSAGES: Record<EinSanityFailureReason, string> = {
  format: 'Enter your EIN in the format XX-XXXXXXX.',
  placeholder:
    "That looks like a placeholder, not a real EIN. Please enter your campaign's EIN.",
  'ssn-shaped':
    'That looks like a Social Security number, not an EIN. Please enter your campaign EIN.',
  'invalid-prefix':
    "That EIN's prefix isn't one the IRS issues. Please double-check your EIN.",
}

const fail = (reason: EinSanityFailureReason): EinSanityResult => ({
  valid: false,
  reason,
  message: FAILURE_MESSAGES[reason],
})

/**
 * Client-side sanity check for an EIN. Catches obviously-bad values (placeholder,
 * SSN-shaped, non-IRS prefix) that pass the shape-only `isValidEIN` check today.
 * Returns a specific reason on failure so the UI can explain what's wrong.
 *
 * This does NOT prove an EIN is real or registered; it only rejects values that
 * cannot be a valid EIN.
 */
export const checkEinSanity = (value: string): EinSanityResult => {
  if (!EIN_PATTERN_FULL.test(value)) {
    return fail('format')
  }

  // EIN_PATTERN_FULL guarantees `XX-XXXXXXX`, so digits is exactly 9 chars.
  const digits = value.replace('-', '')

  // All-same-digit (e.g. 11-1111111) and the common placeholder 12-3456789.
  const allSameDigit = digits.split('').every((d) => d === digits[0])
  if (allSameDigit || value === '12-3456789') {
    return fail('placeholder')
  }

  // SSN-shaped area prefixes the IRS never issues. We deliberately do NOT reject
  // the whole 900-999 range here: 90-95, 98, and 99 are legitimate IRS-issued
  // EIN prefixes, and VALID_EIN_PREFIXES below is the authoritative filter that
  // already excludes the 9x prefixes the IRS does not use (96, 97).
  const areaDigits = digits.slice(0, 3)
  if (areaDigits === '000' || areaDigits === '666') {
    return fail('ssn-shaped')
  }

  if (!VALID_EIN_PREFIXES.has(digits.slice(0, 2))) {
    return fail('invalid-prefix')
  }

  return { valid: true }
}

/**
 * Validation-icon state for an EIN field. Drives `AsyncValidationIcon`:
 *  - `true`  → fully-formed AND sane EIN — green check.
 *  - `false` → fully-formed but fails sanity (placeholder / SSN-shaped / bad
 *              prefix) — red X. Only reached once the value matches XX-XXXXXXX,
 *              so a partially-typed EIN never flashes an error.
 *  - `null`  → incomplete or wrong-shaped — neutral help icon (no error while
 *              the user is still typing).
 */
export const einIndicatorState = (value: string): boolean | null =>
  isValidEIN(value) ? checkEinSanity(value).valid : null
