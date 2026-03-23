import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePositionName } from './usePositionName'

const mockUseOrganizationIfEnabled = vi.fn()
const mockUseCampaign = vi.fn()

vi.mock('@shared/organization-picker', () => ({
  useOrganizationIfEnabled: () => mockUseOrganizationIfEnabled(),
}))

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => mockUseCampaign(),
}))

beforeEach(() => {
  mockUseOrganizationIfEnabled.mockReset()
  mockUseCampaign.mockReturnValue([null])
})

describe('usePositionName', () => {
  it('returns organization positionName when organization is present', () => {
    mockUseOrganizationIfEnabled.mockReturnValue({
      slug: 'org-one',
      name: '2026 Campaign',
      positionName: 'Mayor',
      electedOfficeId: null,
      campaignId: 1,
    })

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('Mayor')
  })

  it('returns campaign positionName when organization is undefined (flag off)', () => {
    mockUseOrganizationIfEnabled.mockReturnValue(undefined)
    mockUseCampaign.mockReturnValue([{ positionName: 'City Council' }])

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('City Council')
  })

  it('returns empty string when both organization and campaign have no positionName', () => {
    mockUseOrganizationIfEnabled.mockReturnValue(undefined)
    mockUseCampaign.mockReturnValue([null])

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('')
  })

  it('returns campaign positionName when organization positionName is null', () => {
    mockUseOrganizationIfEnabled.mockReturnValue({
      slug: 'org-one',
      name: '2026 Campaign',
      positionName: null,
      electedOfficeId: null,
      campaignId: 1,
    })
    mockUseCampaign.mockReturnValue([{ positionName: 'School Board' }])

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('School Board')
  })
})
