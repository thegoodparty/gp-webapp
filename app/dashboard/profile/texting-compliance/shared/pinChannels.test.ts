import { describe, it, expect } from 'vitest'
import { getPinChannels, formatPinChannels } from './pinChannels'
import type { TcrCompliance } from 'helpers/types'

const baseCompliance: TcrCompliance = {
  id: 'tcr-1',
  ein: '12-3456789',
  postalAddress: '',
  committeeName: 'Test',
  websiteDomain: 'example.com',
  filingUrl: 'https://example.com/filing',
  phone: '',
  email: '',
  status: 'submitted',
  createdAt: new Date(),
  updatedAt: new Date(),
  campaignId: 1,
}

describe('getPinChannels', () => {
  it('returns an empty list when nothing is filled', () => {
    expect(getPinChannels(baseCompliance)).toEqual([])
  })

  it('returns email/phone/address only for filled fields', () => {
    expect(
      getPinChannels({
        ...baseCompliance,
        email: 'jane@example.com',
        phone: '5555555555',
        postalAddress: '',
      }),
    ).toEqual(['email', 'phone'])
  })

  it('returns all three when all are filled', () => {
    expect(
      getPinChannels({
        ...baseCompliance,
        email: 'jane@example.com',
        phone: '5555555555',
        postalAddress: '123 Main St',
      }),
    ).toEqual(['email', 'phone', 'address'])
  })

  it('treats whitespace-only values as empty', () => {
    expect(
      getPinChannels({
        ...baseCompliance,
        email: '   ',
        phone: '5555555555',
      }),
    ).toEqual(['phone'])
  })

  it('returns an empty list when given null/undefined', () => {
    expect(getPinChannels(null)).toEqual([])
    expect(getPinChannels(undefined)).toEqual([])
  })
})

describe('formatPinChannels', () => {
  it('joins three channels with commas and "or"', () => {
    expect(formatPinChannels(['email', 'phone', 'address'])).toBe(
      'email, phone or address',
    )
  })

  it('joins two channels with "or"', () => {
    expect(formatPinChannels(['email', 'phone'])).toBe('email or phone')
  })

  it('returns a single channel as-is', () => {
    expect(formatPinChannels(['email'])).toBe('email')
  })

  it('returns an empty string for no channels', () => {
    expect(formatPinChannels([])).toBe('')
  })
})
