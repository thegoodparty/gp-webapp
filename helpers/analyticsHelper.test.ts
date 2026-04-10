import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('./segmentHelper', () => ({
  segmentTrackEvent: vi.fn(),
}))

vi.mock('app/shared/utils/analytics', () => ({
  getReadyAnalytics: vi.fn(),
}))

import { trackEvent, setImpersonating } from './analyticsHelper'
import { segmentTrackEvent } from './segmentHelper'

describe('trackEvent', () => {
  beforeEach(() => {
    setImpersonating(false)
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
    setImpersonating(true)

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
    setImpersonating(true)

    trackEvent('Test Event', { impersonation: false })

    expect(segmentTrackEvent).toHaveBeenCalledWith(
      'Test Event',
      expect.objectContaining({
        impersonation: true,
      }),
    )
  })
})
