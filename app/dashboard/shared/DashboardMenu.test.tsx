import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import DashboardMenu from 'app/dashboard/shared/DashboardMenu'

const mockUseCampaign = vi.fn()
const mockUseEcanvasser = vi.fn()
const mockUseElectedOffice = vi.fn()
const mockUseFlagOn = vi.fn()
const mockUseImpersonateUser = vi.fn()
const mockUseUser = vi.fn()
const mockUseOrganization = vi.fn()

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => mockUseCampaign(),
}))

vi.mock('@shared/hooks/useEcanvasser', () => ({
  useEcanvasser: () => mockUseEcanvasser(),
}))

vi.mock('@shared/hooks/useElectedOffice', () => ({
  useElectedOffice: () => mockUseElectedOffice(),
}))

vi.mock('@shared/experiments/FeatureFlagsProvider', () => ({
  useFlagOn: (...args: unknown[]) => mockUseFlagOn(...args),
}))

vi.mock('@shared/hooks/useImpersonateUser', () => ({
  useImpersonateUser: () => mockUseImpersonateUser(),
}))

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}))

vi.mock('@styleguide', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@styleguide')>()
  return {
    ...actual,
    useSidebar: () => ({
      setOpenMobile: vi.fn(),
      isMobile: false,
    }),
  }
})

vi.mock('@shared/organization-picker', () => ({
  useOrganization: () => mockUseOrganization(),
  OrganizationPicker: () => null,
  OrganizationProvider: ({
    children,
  }: {
    children: React.ReactNode
  }) => children,
}))

vi.mock('helpers/analyticsHelper', () => ({
  EVENTS: { Navigation: { Dashboard: {} } },
  trackEvent: vi.fn(),
}))

vi.mock('@shared/utils/syncEcanvasser', () => ({
  syncEcanvasser: vi.fn(),
}))

const baseCampaign = {
  id: 1,
  slug: 'test',
  isActive: true,
  isDemo: false,
  isPro: false,
  data: {},
  details: {},
}

beforeEach(() => {
  mockUseCampaign.mockReturnValue([baseCampaign])
  mockUseEcanvasser.mockReturnValue([null, vi.fn()])
  mockUseElectedOffice.mockReturnValue({
    data: null,
    isLoading: false,
    isError: false,
  })
  mockUseFlagOn.mockReturnValue({ ready: true, on: false })
  mockUseImpersonateUser.mockReturnValue({
    user: null,
    token: null,
    impersonate: vi.fn(),
    clear: vi.fn(),
  })
  mockUseUser.mockReturnValue([
    {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      avatar: null,
      roles: ['candidate'],
    },
    vi.fn(),
  ])
  mockUseOrganization.mockReturnValue({
    slug: 'org-one',
    name: 'My Campaign',
    positionName: 'Mayor',
    electedOfficeId: null,
    campaignId: 1,
  })
})

describe('DashboardMenu - AI Insights visibility', () => {
  it('shows AI Insights for VIP beta users', () => {
    mockUseCampaign.mockReturnValue([
      { ...baseCampaign, details: { isAiBetaVip: true } },
    ])

    render(<DashboardMenu pathname="/dashboard" />)

    expect(screen.getByText('AI Insights')).toBeInTheDocument()
  })

  it('does not show AI Insights for non-VIP users who are not impersonated', () => {
    mockUseCampaign.mockReturnValue([
      { ...baseCampaign, details: { isAiBetaVip: false } },
    ])

    render(<DashboardMenu pathname="/dashboard" />)

    expect(screen.queryByText('AI Insights')).not.toBeInTheDocument()
  })

  it('does not show AI Insights for elected office users without VIP', () => {
    mockUseCampaign.mockReturnValue([
      { ...baseCampaign, details: { isAiBetaVip: false } },
    ])
    mockUseElectedOffice.mockReturnValue({
      data: { id: 'eo-123', swornInDate: '2024-01-01' },
      isLoading: false,
      isError: false,
    })

    render(<DashboardMenu pathname="/dashboard" />)

    expect(screen.queryByText('AI Insights')).not.toBeInTheDocument()
  })

  it('shows AI Insights for elected office users with VIP', () => {
    mockUseCampaign.mockReturnValue([
      { ...baseCampaign, details: { isAiBetaVip: true } },
    ])
    mockUseElectedOffice.mockReturnValue({
      data: { id: 'eo-123', swornInDate: '2024-01-01' },
      isLoading: false,
      isError: false,
    })

    render(<DashboardMenu pathname="/dashboard" />)

    expect(screen.getByText('AI Insights')).toBeInTheDocument()
  })

  it('shows AI Insights when impersonating a non-VIP user', () => {
    mockUseCampaign.mockReturnValue([
      { ...baseCampaign, details: { isAiBetaVip: false } },
    ])
    mockUseImpersonateUser.mockReturnValue({
      user: { id: 'admin-1', email: 'admin@test.local' },
      token: 'impersonate-token-abc',
      impersonate: vi.fn(),
      clear: vi.fn(),
    })

    render(<DashboardMenu pathname="/dashboard" />)

    expect(screen.getByText('AI Insights')).toBeInTheDocument()
  })

  it('shows AI Insights when impersonating a user with no details', () => {
    mockUseCampaign.mockReturnValue([
      { ...baseCampaign, details: {} },
    ])
    mockUseImpersonateUser.mockReturnValue({
      user: { id: 'admin-1', email: 'admin@test.local' },
      token: 'impersonate-token-abc',
      impersonate: vi.fn(),
      clear: vi.fn(),
    })

    render(<DashboardMenu pathname="/dashboard" />)

    expect(screen.getByText('AI Insights')).toBeInTheDocument()
  })
})
