import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePositionName } from './usePositionName'

const mockUseOrganization = vi.fn()

vi.mock('@shared/organization-picker', () => ({
  useOrganization: () => mockUseOrganization(),
}))

beforeEach(() => {
  mockUseOrganization.mockReset()
})

describe('usePositionName', () => {
  it('returns organization positionName when present', () => {
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

  it('returns empty string when positionName is null', () => {
    mockUseOrganization.mockReturnValue({
      slug: 'org-one',
      name: '2026 Campaign',
      positionName: null,
      electedOfficeId: null,
      campaignId: 1,
    })

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('')
  })
})
