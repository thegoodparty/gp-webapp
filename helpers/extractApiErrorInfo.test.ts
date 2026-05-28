import { describe, it, expect } from 'vitest'
import { extractApiErrorInfo } from './extractApiErrorInfo'

describe('extractApiErrorInfo', () => {
  it('returns empty object for null', () => {
    expect(extractApiErrorInfo(null)).toEqual({})
  })

  it('returns empty object for undefined', () => {
    expect(extractApiErrorInfo(undefined)).toEqual({})
  })

  it('returns empty object for non-object primitives', () => {
    expect(extractApiErrorInfo('boom')).toEqual({})
    expect(extractApiErrorInfo(42)).toEqual({})
    expect(extractApiErrorInfo(false)).toEqual({})
  })

  it('extracts a string message', () => {
    expect(extractApiErrorInfo({ message: 'Something failed' })).toEqual({
      message: 'Something failed',
      errorCode: undefined,
    })
  })

  it('joins an array message into a comma-separated string', () => {
    expect(
      extractApiErrorInfo({
        message: ['email is required', 'name is required'],
      }),
    ).toEqual({
      message: 'email is required, name is required',
      errorCode: undefined,
    })
  })

  it('filters out non-string entries when joining an array message', () => {
    expect(
      extractApiErrorInfo({ message: ['valid', 42, null, 'also valid'] }),
    ).toEqual({
      message: 'valid, also valid',
      errorCode: undefined,
    })
  })

  it('returns undefined message when the message field is neither string nor array', () => {
    expect(extractApiErrorInfo({ message: { nested: 'shape' } })).toEqual({
      message: undefined,
      errorCode: undefined,
    })
  })

  it('extracts a string errorCode', () => {
    expect(
      extractApiErrorInfo({ message: 'oops', errorCode: 'EMAIL_TAKEN' }),
    ).toEqual({
      message: 'oops',
      errorCode: 'EMAIL_TAKEN',
    })
  })

  it('returns undefined errorCode when it is not a string', () => {
    expect(extractApiErrorInfo({ message: 'oops', errorCode: 123 })).toEqual({
      message: 'oops',
      errorCode: undefined,
    })
  })

  it('returns both fields undefined when neither key is present', () => {
    expect(extractApiErrorInfo({})).toEqual({
      message: undefined,
      errorCode: undefined,
    })
  })
})
