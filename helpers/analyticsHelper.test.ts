import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('./segmentHelper', () => ({
  segmentTrackEvent: vi.fn(),
}))

vi.mock('app/shared/utils/analytics', () => ({
  getReadyAnalytics: vi.fn(),
}))

import { trackEvent, setImpersonating, setUserEmail } from './analyticsHelper'
import { segmentTrackEvent } from './segmentHelper'

describe('trackEvent', () => {
  beforeEach(() => {
    setImpersonating(false)
    setUserEmail(undefined)
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

  it('does not include email when no user email is set', () => {
    trackEvent('Test Event', { foo: 'bar' })

    expect(segmentTrackEvent).toHaveBeenCalledWith(
      'Test Event',
      expect.not.objectContaining({ email: expect.anything() }),
    )
  })

  it('includes email on every event once the user email is set', () => {
    setUserEmail('jane@example.com')

    trackEvent('Test Event', { foo: 'bar' })

    expect(segmentTrackEvent).toHaveBeenCalledWith(
      'Test Event',
      expect.objectContaining({
        foo: 'bar',
        email: 'jane@example.com',
      }),
    )
  })

  it('caller-provided email overrides the persisted user email', () => {
    setUserEmail('jane@example.com')

    trackEvent('Test Event', { email: 'override@example.com' })

    expect(segmentTrackEvent).toHaveBeenCalledWith(
      'Test Event',
      expect.objectContaining({
        email: 'override@example.com',
      }),
    )
  })
})
