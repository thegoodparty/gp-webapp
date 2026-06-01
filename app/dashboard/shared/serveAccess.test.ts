import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Organization } from 'gpApi/api-endpoints'
import serveAccess from './serveAccess'

const {
  mockServerFetch,
  mockGetCurrentUserOrganizations,
  mockCookiesGet,
  mockHeadersGet,
  mockRedirect,
} = vi.hoisted(() => ({
  mockServerFetch: vi.fn(),
  mockGetCurrentUserOrganizations: vi.fn(),
  mockCookiesGet: vi.fn(),
  mockHeadersGet: vi.fn(),
  mockRedirect: vi.fn(),
}))

vi.mock('gpApi/serverFetch', () => ({
  serverFetch: (...args: unknown[]) => mockServerFetch(...args),
}))

vi.mock('helpers/getCurrentUserOrganizations', () => ({
  getCurrentUserOrganizations: () => mockGetCurrentUserOrganizations(),
}))

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => mockCookiesGet(name),
    }),
  headers: () =>
    Promise.resolve({
      get: (name: string) => mockHeadersGet(name),
    }),
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}))

const campaignOrg: Organization = {
  slug: 'campaign-1',
  name: '2026 Campaign',
  positionName: null,
  position: null,
  district: null,
  electedOfficeId: null,
  campaignId: 1,
}

const electedOfficeOrg: Organization = {
  ...campaignOrg,
  slug: 'serve-org',
  name: 'Serve Org',
  electedOfficeId: 'eo-123',
}

const setCookieSlug = (slug?: string) =>
  mockCookiesGet.mockImplementation((name: string) =>
    name === 'organization-slug' && slug ? { value: slug } : undefined,
  )

const setPathname = (pathname: string) =>
  mockHeadersGet.mockImplementation((name: string) =>
    name === 'x-pathname' ? pathname : null,
  )

beforeEach(() => {
  vi.clearAllMocks()
  mockRedirect.mockImplementation(() => undefined as never)
  mockGetCurrentUserOrganizations.mockResolvedValue([campaignOrg])
  setCookieSlug(undefined)
  setPathname('/dashboard/briefings')
})

describe('serveAccess', () => {
  it('returns without redirecting when the elected-office lookup succeeds', async () => {
    mockServerFetch.mockResolvedValue({ ok: true, data: { id: 'eo-123' } })

    await serveAccess()

    expect(mockRedirect).not.toHaveBeenCalled()
    expect(mockGetCurrentUserOrganizations).not.toHaveBeenCalled()
  })

  it('switches org via post-auth-redirect when an elected-office org is not selected', async () => {
    mockServerFetch.mockResolvedValue({ ok: false, data: null })
    mockGetCurrentUserOrganizations.mockResolvedValue([
      campaignOrg,
      electedOfficeOrg,
    ])
    setCookieSlug('campaign-1')
    setPathname('/dashboard/briefings')

    await serveAccess()

    expect(mockRedirect).toHaveBeenCalledWith(
      '/post-auth-redirect?next=%2Fdashboard%2Fbriefings',
    )
  })

  it('preserves the requested serve path (polls / specific briefing) as next', async () => {
    mockServerFetch.mockResolvedValue({ ok: false, data: null })
    mockGetCurrentUserOrganizations.mockResolvedValue([
      campaignOrg,
      electedOfficeOrg,
    ])
    setCookieSlug('campaign-1')
    setPathname('/dashboard/polls/42')

    await serveAccess()

    expect(mockRedirect).toHaveBeenCalledWith(
      '/post-auth-redirect?next=%2Fdashboard%2Fpolls%2F42',
    )
  })

  it('falls back to /dashboard (no loop) when the elected-office org is already selected', async () => {
    mockServerFetch.mockResolvedValue({ ok: false, data: null })
    mockGetCurrentUserOrganizations.mockResolvedValue([electedOfficeOrg])
    setCookieSlug('serve-org')

    await serveAccess()

    expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
  })

  it('bounces to /dashboard when the user has no elected-office org', async () => {
    mockServerFetch.mockResolvedValue({ ok: false, data: null })
    mockGetCurrentUserOrganizations.mockResolvedValue([campaignOrg])
    setCookieSlug('campaign-1')

    await serveAccess()

    expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
  })
})
