import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('./segmentHelper', () => ({
  segmentTrackEvent: vi.fn(),
}))

vi.mock('app/shared/utils/analytics', () => ({
  getReadyAnalytics: vi.fn(),
}))

import { trackEvent } from './analyticsHelper'
import { segmentTrackEvent } from './segmentHelper'

const clearCookies = () => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/')
  })
}

describe('trackEvent', () => {
  beforeEach(() => {
    clearCookies()
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('includes impersonation: false when not impersonating', () => {
    trackEvent('Test Event', { foo: 'bar' })

    expect(segmentTrackEvent).toHaveBeenCalledWith(
      'Test Event',
      expect.objectContaining({
        foo: 'bar',
        impersonation: false,
      }),
    )
  })

  it('includes impersonation: true when impersonating', () => {
    document.cookie = 'impersonateUser=' + encodeURI(JSON.stringify({ id: 1 }))

    trackEvent('Test Event', { foo: 'bar' })

    expect(segmentTrackEvent).toHaveBeenCalledWith(
      'Test Event',
      expect.objectContaining({
        foo: 'bar',
        impersonation: true,
      }),
    )
  })

  it('impersonation cannot be overridden by caller properties', () => {
    document.cookie = 'impersonateUser=' + encodeURI(JSON.stringify({ id: 1 }))

    trackEvent('Test Event', { impersonation: false })

    expect(segmentTrackEvent).toHaveBeenCalledWith(
      'Test Event',
      expect.objectContaining({
        impersonation: true,
      }),
    )
  })
})
