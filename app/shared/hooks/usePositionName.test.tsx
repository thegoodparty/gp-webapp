import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePositionName } from './usePositionName'

const mockUseOrganization = vi.fn()
const mockUseCampaign = vi.fn()

vi.mock('@shared/organization-picker', () => ({
  useOrganization: () => mockUseOrganization(),
}))

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => mockUseCampaign(),
}))

beforeEach(() => {
  mockUseOrganization.mockReset()
  mockUseCampaign.mockReturnValue([null])
})

describe('usePositionName', () => {
  it('returns organization positionName when organization is present', () => {
    mockUseOrganization.mockReturnValue({
      slug: 'org-one',
      name: '2026 Campaign',
      positionName: 'Mayor',
      electedOfficeId: null,
      campaignId: 1,
    })

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('Mayor')
  })

  it('falls back to campaign positionName when organization positionName is null', () => {
    mockUseOrganization.mockReturnValue({
      slug: 'org-one',
      name: '2026 Campaign',
      positionName: null,
      electedOfficeId: null,
      campaignId: 1,
    })
    mockUseCampaign.mockReturnValue([{ positionName: 'City Council' }])

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('City Council')
  })

  it('returns empty string when neither organization nor campaign has a positionName', () => {
    mockUseOrganization.mockReturnValue({
      slug: 'org-one',
      name: '2026 Campaign',
      positionName: null,
      electedOfficeId: null,
      campaignId: 1,
    })
    mockUseCampaign.mockReturnValue([null])

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('')
  })
})
