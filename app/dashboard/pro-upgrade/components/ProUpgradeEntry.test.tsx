import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { useQuery } from '@tanstack/react-query'
import ProUpgradeEntry from './ProUpgradeEntry'

// Mock only useQuery so we control pending vs resolved; keep the real
// QueryClient/QueryClientProvider that the render helper relies on.
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return { ...actual, useQuery: vi.fn() }
})

const mockUseQuery = vi.mocked(useQuery)

const queryResult = (isPending: boolean): ReturnType<typeof useQuery> =>
  ({ data: null, isPending } as unknown as ReturnType<typeof useQuery>)

describe('ProUpgradeEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a spinner and does not redirect while the queries are pending', () => {
    mockUseQuery.mockReturnValue(queryResult(true))

    render(<ProUpgradeEntry />)

    // LoadingAnimation renders a "POWERED BY" marker.
    expect(screen.getByText(/powered by/i)).toBeInTheDocument()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it('renders nothing once the queries resolve and schedules the redirect', () => {
    mockUseQuery.mockReturnValue(queryResult(false))

    const { container } = render(<ProUpgradeEntry />)

    // No canonical state → first incomplete step is the value-prop intro.
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText(/powered by/i)).not.toBeInTheDocument()
    expect(router.replace).toHaveBeenCalledWith(
      '/dashboard/pro-upgrade/value-prop',
    )
  })
})
