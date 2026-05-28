import { describe, it, expect } from 'vitest'
import { resolvePostAuthRedirectPath } from './resolvePostAuthRedirectPath.util'

describe('resolvePostAuthRedirectPath', () => {
  it('routes a sales user to the sales add-campaign page', () => {
    expect(
      resolvePostAuthRedirectPath({ roles: ['sales', 'admin'] }, null),
    ).toBe('/sales/add-campaign')
  })

  it('prefers the sales role over any campaign status', () => {
    expect(
      resolvePostAuthRedirectPath(
        { roles: ['sales'] },
        { status: 'candidate' },
      ),
    ).toBe('/sales/add-campaign')
  })

  it('routes a candidate to the dashboard', () => {
    expect(resolvePostAuthRedirectPath(null, { status: 'candidate' })).toBe(
      '/dashboard',
    )
  })

  it('routes an onboarding user to the slug + step path', () => {
    expect(
      resolvePostAuthRedirectPath(null, {
        status: 'onboarding',
        slug: 'jane-doe',
        step: 4,
      }),
    ).toBe('/onboarding/jane-doe/4')
  })

  it('defaults onboarding step to 1 when missing', () => {
    expect(
      resolvePostAuthRedirectPath(null, {
        status: 'onboarding',
        slug: 'jane-doe',
      }),
    ).toBe('/onboarding/jane-doe/1')
  })

  it('falls through to /dashboard/profile when onboarding has no slug', () => {
    expect(resolvePostAuthRedirectPath(null, { status: 'onboarding' })).toBe(
      '/dashboard/profile',
    )
  })

  it('routes to office-selection when there is no campaign status', () => {
    expect(resolvePostAuthRedirectPath(null, null)).toBe(
      '/onboarding/office-selection',
    )
  })

  it('routes to office-selection when campaign status is false', () => {
    expect(resolvePostAuthRedirectPath(null, { status: false })).toBe(
      '/onboarding/office-selection',
    )
  })

  it('routes a user with elected office and no campaign to the dashboard', () => {
    expect(resolvePostAuthRedirectPath(null, null, true)).toBe('/dashboard')
    expect(resolvePostAuthRedirectPath(null, { status: false }, true)).toBe(
      '/dashboard',
    )
  })

  it('falls back to /dashboard/profile for any other status', () => {
    expect(
      resolvePostAuthRedirectPath(null, { status: 'something-else' }),
    ).toBe('/dashboard/profile')
  })

  it('handles a user without roles', () => {
    expect(resolvePostAuthRedirectPath({}, { status: 'candidate' })).toBe(
      '/dashboard',
    )
  })
})
