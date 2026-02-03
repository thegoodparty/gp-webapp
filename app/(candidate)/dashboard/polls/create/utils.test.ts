import { describe, it, expect } from 'vitest'
import {
  validatePollQuestion,
  getWarningMessage,
  MIN_QUESTION_LENGTH,
  MAX_QUESTION_LENGTH,
} from './utils'

describe('validatePollQuestion', () => {
  it('returns true for empty string (let required rule handle it)', () => {
    expect(validatePollQuestion('')).toBe(true)
    expect(validatePollQuestion('   ')).toBe(true)
  })

  it('returns error when question is too short', () => {
    const shortQuestion = 'Too short'
    expect(validatePollQuestion(shortQuestion)).toBe(
      `Question must be at least ${MIN_QUESTION_LENGTH} characters`
    )
  })

  it('returns error when question exceeds max length', () => {
    const longQuestion = 'a'.repeat(MAX_QUESTION_LENGTH + 1)
    expect(validatePollQuestion(longQuestion)).toBe(
      `Question must be less than ${MAX_QUESTION_LENGTH} characters`
    )
  })

  it('returns true for valid question length (non-blocking)', () => {
    const validQuestion = 'What local issues matter most to you?'
    expect(validatePollQuestion(validQuestion)).toBe(true)
  })

  it('returns true even for biased text (ENG-6403: non-blocking)', () => {
    const biasedQuestion =
      "Don't you think the radical policies are destroying our city?"
    expect(validatePollQuestion(biasedQuestion)).toBe(true)
  })
})

describe('getWarningMessage', () => {
  it('returns null when biasAnalysisState is null', () => {
    expect(getWarningMessage(null)).toBeNull()
  })

  it('returns null when not yet checked', () => {
    expect(
      getWarningMessage({
        hasBias: false,
        hasGrammar: false,
        hasServerError: false,
        hasBeenChecked: false,
      })
    ).toBeNull()
  })

  it('returns null when checked but no issues found', () => {
    expect(
      getWarningMessage({
        hasBias: false,
        hasGrammar: false,
        hasServerError: false,
        hasBeenChecked: true,
      })
    ).toBeNull()
  })

  it('returns bias message when only bias detected', () => {
    expect(
      getWarningMessage({
        hasBias: true,
        hasGrammar: false,
        hasServerError: false,
        hasBeenChecked: true,
      })
    ).toBe('Biased language detected. Please use "Optimize message" to correct it.')
  })

  it('returns grammar message when only grammar issues found', () => {
    expect(
      getWarningMessage({
        hasBias: false,
        hasGrammar: true,
        hasServerError: false,
        hasBeenChecked: true,
      })
    ).toBe('Grammar issues found. Please use "Optimize message" to correct it.')
  })

  it('returns combined message when both bias and grammar detected', () => {
    expect(
      getWarningMessage({
        hasBias: true,
        hasGrammar: true,
        hasServerError: false,
        hasBeenChecked: true,
      })
    ).toBe(
      'Biased language detected. Grammar issues found. Please use "Optimize message" to correct it.'
    )
  })

  it('returns server error message when check failed', () => {
    expect(
      getWarningMessage({
        hasBias: false,
        hasGrammar: false,
        hasServerError: true,
        hasBeenChecked: true,
      })
    ).toBe('Unable to check for bias. You can still proceed or try again later.')
  })

  it('returns server error message even when hasBeenChecked is false (API failure leaves biasAnalysis null)', () => {
    expect(
      getWarningMessage({
        hasBias: false,
        hasGrammar: false,
        hasServerError: true,
        hasBeenChecked: false,
      })
    ).toBe('Unable to check for bias. You can still proceed or try again later.')
  })
})
