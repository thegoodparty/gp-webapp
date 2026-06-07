import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { useQuery } from '@tanstack/react-query'
import { useCampaign } from '@shared/hooks/useCampaign'
import type { Campaign } from 'helpers/types'
import ProUpgradeEntry from './ProUpgradeEntry'

// Mock only useQuery so we control pending vs resolved; keep the real
// QueryClient/QueryClientProvider that the render helper relies on.
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return { ...actual, useQuery: vi.fn() }
})

// Mock useCampaign so we can drive the persisted filing-status answer the
// entry maps into the step derivation.
vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: vi.fn(),
}))

const mockUseQuery = vi.mocked(useQuery)
const mockUseCampaign = vi.mocked(useCampaign)

const queryResult = (
  overrides: { isPending?: boolean; isError?: boolean } = {},
): ReturnType<typeof useQuery> =>
  ({
    data: null,
    isPending: overrides.isPending ?? false,
    isError: overrides.isError ?? false,
    refetch: vi.fn(),
  }) as unknown as ReturnType<typeof useQuery>

describe('ProUpgradeEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default to no campaign; individual cases override.
    mockUseCampaign.mockReturnValue([null])
  })

  it('renders a spinner and does not redirect while the queries are pending', () => {
    mockUseQuery.mockReturnValue(queryResult({ isPending: true }))

    render(<ProUpgradeEntry />)

    // LoadingAnimation renders a "POWERED BY" marker.
    expect(screen.getByText(/powered by/i)).toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it('renders nothing once the queries resolve and schedules the redirect', () => {
    mockUseQuery.mockReturnValue(queryResult())

    const { container } = render(<ProUpgradeEntry />)

    // No canonical state → first incomplete step is the value-prop intro.
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText(/powered by/i)).not.toBeInTheDocument()
    expect(router.replace).toHaveBeenCalledWith(
      '/dashboard/pro-upgrade/value-prop',
    )
  })

  it('respects a persisted "already filed" answer and does not redirect back to the filing-status step', () => {
    // A returning candidate who answered "yes" maps to has-filed, so the
    // router skips the status step. With no EIN yet, the first incomplete step
    // is EIN — never the value-prop intro or a re-ask of the filing question.
    mockUseQuery.mockReturnValue(queryResult())
    mockUseCampaign.mockReturnValue([
      { details: { hasFiledForRace: true } } as Campaign,
    ])

    render(<ProUpgradeEntry />)

    expect(router.replace).toHaveBeenCalledWith('/dashboard/pro-upgrade/ein')
  })

  it('shows a recoverable error and does not redirect when a query fails', () => {
    // A failed fetch leaves data undefined; redirecting would mis-derive a
    // returning candidate back to the intro as if they had zero progress.
    mockUseQuery.mockReturnValue(queryResult({ isError: true }))

    render(<ProUpgradeEntry />)

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })
})
