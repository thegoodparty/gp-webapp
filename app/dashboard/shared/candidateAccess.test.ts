import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Organization } from 'gpApi/api-endpoints'
import candidateAccess from './candidateAccess'

const {
  mockAuth,
  mockHeadersGet,
  mockRedirect,
  mockGetCurrentUserOrganizations,
} = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockHeadersGet: vi.fn(),
  mockRedirect: vi.fn(),
  mockGetCurrentUserOrganizations: vi.fn(),
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}))

vi.mock('next/headers', () => ({
  headers: () =>
    Promise.resolve({
      get: (name: string) => mockHeadersGet(name),
    }),
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}))

vi.mock('helpers/getCurrentUserOrganizations', () => ({
  getCurrentUserOrganizations: () => mockGetCurrentUserOrganizations(),
}))

const minimalOrg: Organization = {
  slug: 'campaign-1',
  name: '2026 Campaign',
  positionName: null,
  position: null,
  district: null,
  electedOfficeId: null,
  campaignId: 1,
}

beforeEach(() => {
  vi.clearAllMocks()
  mockRedirect.mockImplementation(() => undefined as never)
  mockGetCurrentUserOrganizations.mockResolvedValue([minimalOrg])
})

describe('candidateAccess', () => {
  it('redirects to sign-up when there is no Clerk userId', async () => {
    mockAuth.mockResolvedValue({ userId: null, actor: null })

    await candidateAccess()

    expect(mockRedirect).toHaveBeenCalledWith('/sign-up')
    expect(mockGetCurrentUserOrganizations).not.toHaveBeenCalled()
  })

  it('redirects orgless users away from /dashboard to office selection', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_2abc',
      actor: { sub: 'admin' },
    })
    mockHeadersGet.mockImplementation((name) =>
      name === 'x-pathname' ? '/dashboard' : null,
    )
    mockGetCurrentUserOrganizations.mockResolvedValue([])

    await candidateAccess()

    expect(mockGetCurrentUserOrganizations).toHaveBeenCalledOnce()
    expect(mockRedirect).toHaveBeenCalledWith('/onboarding/office-selection')
  })

  it('does not fetch organizations or redirect for orgless non-dashboard routes', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_2abc',
      actor: { sub: 'admin' },
    })
    mockHeadersGet.mockImplementation((name) =>
      name === 'x-pathname' ? '/polls/welcome' : null,
    )

    await candidateAccess()

    expect(mockGetCurrentUserOrganizations).not.toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('does not redirect to office selection when user has organizations on dashboard', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_2abc',
      actor: { sub: 'admin' },
    })
    mockHeadersGet.mockImplementation((name) =>
      name === 'x-pathname' ? '/dashboard/campaign-details' : null,
    )
    mockGetCurrentUserOrganizations.mockResolvedValue([minimalOrg])

    await candidateAccess()

    expect(mockGetCurrentUserOrganizations).toHaveBeenCalledOnce()
    expect(mockRedirect).not.toHaveBeenCalledWith(
      '/onboarding/office-selection',
    )
  })
})
