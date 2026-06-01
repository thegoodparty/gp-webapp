import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import PostAuthRedirectPage from './page'

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(() => ({
    isSignedIn: true,
    isLoaded: true,
    user: {
      primaryEmailAddress: { emailAddress: 'clerk-fallback@example.com' },
    },
  })),
}))

const mockSetCookie = vi.fn<(name: string, value: string) => void>()
vi.mock('helpers/cookieHelper', () => ({
  getCookie: vi.fn(() => false),
  setCookie: (name: string, value: string) => mockSetCookie(name, value),
  deleteCookie: vi.fn(),
}))

const mockTrackRegistration =
  vi.fn<(args: { userId: string; email?: string }) => void>()
vi.mock('helpers/analyticsHelper', () => ({
  trackRegistrationCompleted: (args: { userId: string; email?: string }) =>
    mockTrackRegistration(args),
}))
vi.mock('@shared/utils/analytics', () => ({
  getReadyAnalytics: vi.fn().mockResolvedValue(null),
}))

let replaceSpy: ReturnType<typeof vi.fn>

const setLocation = (search = '') => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, replace: replaceSpy, search },
  })
}

beforeEach(() => {
  mockSetCookie.mockClear()
  mockTrackRegistration.mockClear()
  replaceSpy = vi.fn()
  setLocation('')
})

afterEach(() => {
  vi.useRealTimers()
})

const orgFixture = {
  slug: 'org-one',
  name: 'Org One',
  positionName: null,
  position: null,
  district: null,
  electedOfficeId: null,
  campaignId: 1,
}

describe('PostAuthRedirectPage', () => {
  it('happy path: orgs returned, resolves to /dashboard for active candidate', async () => {
    api.mock('GET /v1/organizations', {
      status: 200,
      data: { organizations: [orgFixture] },
    })
    api.mock('GET /v1/users/me', { status: 200, data: { roles: [] } as any })
    api.mock('GET /v1/campaigns/mine/status', {
      status: 200,
      data: { status: 'candidate', slug: 'org-one' },
    })
    api.mock('GET /v1/elected-office/current', {
      status: 404,
      data: { message: 'none' },
    })

    render(<PostAuthRedirectPage />)

    await waitFor(() => expect(replaceSpy).toHaveBeenCalledWith('/dashboard'))
    expect(mockSetCookie).toHaveBeenCalledWith('organization-slug', 'org-one')
  })

  it('retry path: first orgs call fails, second succeeds; uses retry orgs', async () => {
    api.mockOrdered('GET /v1/organizations', [
      { status: 500, data: { message: 'transient' } },
      { status: 200, data: { organizations: [orgFixture] } },
    ])
    api.mock('GET /v1/users/me', { status: 200, data: { roles: [] } as any })
    api.mock('GET /v1/campaigns/mine/status', {
      status: 200,
      data: { status: 'candidate', slug: 'org-one' },
    })
    api.mock('GET /v1/elected-office/current', {
      status: 404,
      data: { message: 'none' },
    })

    render(<PostAuthRedirectPage />)

    await waitFor(() => expect(replaceSpy).toHaveBeenCalledWith('/dashboard'), {
      timeout: 3000,
    })
    expect(mockSetCookie).toHaveBeenCalledWith('organization-slug', 'org-one')
  })

  it('double-failure path: both orgs calls fail; falls through to /onboarding/office-selection', async () => {
    api.mock('GET /v1/organizations', {
      status: 500,
      data: { message: 'down' },
    })
    api.mock('GET /v1/users/me', { status: 500, data: { message: 'down' } })
    api.mock('GET /v1/campaigns/mine/status', {
      status: 500,
      data: { message: 'down' },
    })
    api.mock('GET /v1/elected-office/current', {
      status: 500,
      data: { message: 'down' },
    })

    render(<PostAuthRedirectPage />)

    await waitFor(
      () =>
        expect(replaceSpy).toHaveBeenCalledWith('/onboarding/office-selection'),
      { timeout: 3000 },
    )
    expect(mockSetCookie).not.toHaveBeenCalled()
  })

  it('redirects to /login when not signed in', async () => {
    const clerkMod = await import('@clerk/nextjs')
    vi.mocked(clerkMod.useUser).mockReturnValueOnce({
      isSignedIn: false,
      isLoaded: true,
    } as any)

    render(<PostAuthRedirectPage />)

    await waitFor(() => expect(replaceSpy).toHaveBeenCalledWith('/login'))
  })

  it('signup source + fresh createdAt: fires trackRegistrationCompleted', async () => {
    setLocation('?source=signup')
    api.mock('GET /v1/organizations', {
      status: 200,
      data: { organizations: [orgFixture] },
    })
    api.mock('GET /v1/users/me', {
      status: 200,
      data: {
        id: 42,
        email: 'new-user@example.com',
        roles: [],
        createdAt: new Date().toISOString(),
      } as any,
    })
    api.mock('GET /v1/campaigns/mine/status', {
      status: 200,
      data: { status: 'candidate', slug: 'org-one' },
    })
    api.mock('GET /v1/elected-office/current', {
      status: 404,
      data: { message: 'none' },
    })

    render(<PostAuthRedirectPage />)

    await waitFor(() => expect(replaceSpy).toHaveBeenCalledWith('/dashboard'))
    expect(mockTrackRegistration).toHaveBeenCalledTimes(1)
    expect(mockTrackRegistration).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: '42',
        email: 'new-user@example.com',
      }),
    )
  })

  it('signup source + stale createdAt: does NOT fire (URL-tampering guard)', async () => {
    setLocation('?source=signup')
    api.mock('GET /v1/organizations', {
      status: 200,
      data: { organizations: [orgFixture] },
    })
    api.mock('GET /v1/users/me', {
      status: 200,
      data: {
        id: 42,
        email: 'old-user@example.com',
        roles: [],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      } as any,
    })
    api.mock('GET /v1/campaigns/mine/status', {
      status: 200,
      data: { status: 'candidate', slug: 'org-one' },
    })
    api.mock('GET /v1/elected-office/current', {
      status: 404,
      data: { message: 'none' },
    })

    render(<PostAuthRedirectPage />)

    await waitFor(() => expect(replaceSpy).toHaveBeenCalledWith('/dashboard'))
    expect(mockTrackRegistration).not.toHaveBeenCalled()
  })

  it('next param: honors a same-origin deep link over the resolved path', async () => {
    setLocation('?next=%2Fdashboard%2Fbriefings')
    api.mock('GET /v1/organizations', {
      status: 200,
      data: { organizations: [orgFixture] },
    })
    api.mock('GET /v1/users/me', { status: 200, data: { roles: [] } as any })
    api.mock('GET /v1/campaigns/mine/status', {
      status: 200,
      data: { status: 'candidate', slug: 'org-one' },
    })
    api.mock('GET /v1/elected-office/current', {
      status: 404,
      data: { message: 'none' },
    })

    render(<PostAuthRedirectPage />)

    await waitFor(() =>
      expect(replaceSpy).toHaveBeenCalledWith('/dashboard/briefings'),
    )
    // Org context is still established before navigating to the deep link.
    expect(mockSetCookie).toHaveBeenCalledWith('organization-slug', 'org-one')
  })

  it('next param: selects the elected-office org for a briefings deep link', async () => {
    setLocation('?next=%2Fdashboard%2Fbriefings')
    const electedOfficeOrg = {
      ...orgFixture,
      slug: 'serve-org',
      name: 'Serve Org',
      electedOfficeId: 'eo-123',
    }
    api.mock('GET /v1/organizations', {
      status: 200,
      // Campaign org first (resolveSlug would otherwise pick this one).
      data: { organizations: [orgFixture, electedOfficeOrg] },
    })
    api.mock('GET /v1/users/me', { status: 200, data: { roles: [] } as any })
    api.mock('GET /v1/campaigns/mine/status', {
      status: 200,
      data: { status: 'candidate', slug: 'org-one' },
    })
    api.mock('GET /v1/elected-office/current', {
      status: 200,
      data: { id: 'eo-123' },
    })

    render(<PostAuthRedirectPage />)

    await waitFor(() =>
      expect(mockSetCookie).toHaveBeenCalledWith(
        'organization-slug',
        'serve-org',
      ),
    )
    expect(replaceSpy).toHaveBeenCalledWith('/dashboard/briefings')
  })

  it('next param: ignores protocol-relative/open-redirect values', async () => {
    setLocation('?next=%2F%2Fevil.com')
    api.mock('GET /v1/organizations', {
      status: 200,
      data: { organizations: [orgFixture] },
    })
    api.mock('GET /v1/users/me', { status: 200, data: { roles: [] } as any })
    api.mock('GET /v1/campaigns/mine/status', {
      status: 200,
      data: { status: 'candidate', slug: 'org-one' },
    })
    api.mock('GET /v1/elected-office/current', {
      status: 404,
      data: { message: 'none' },
    })

    render(<PostAuthRedirectPage />)

    await waitFor(() => expect(replaceSpy).toHaveBeenCalledWith('/dashboard'))
  })

  it('login (no source param): does not fire trackRegistrationCompleted', async () => {
    api.mock('GET /v1/organizations', {
      status: 200,
      data: { organizations: [orgFixture] },
    })
    api.mock('GET /v1/users/me', {
      status: 200,
      data: {
        id: 42,
        email: 'returning@example.com',
        roles: [],
        createdAt: new Date().toISOString(),
      } as any,
    })
    api.mock('GET /v1/campaigns/mine/status', {
      status: 200,
      data: { status: 'candidate', slug: 'org-one' },
    })
    api.mock('GET /v1/elected-office/current', {
      status: 404,
      data: { message: 'none' },
    })

    render(<PostAuthRedirectPage />)

    await waitFor(() => expect(replaceSpy).toHaveBeenCalledWith('/dashboard'))
    expect(mockTrackRegistration).not.toHaveBeenCalled()
  })
})
