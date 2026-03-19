import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePositionName } from './usePositionName'

const mockUseOrganizationIfEnabled = vi.fn()

vi.mock('@shared/organization-picker', () => ({
  useOrganizationIfEnabled: () => mockUseOrganizationIfEnabled(),
}))

beforeEach(() => {
  mockUseOrganizationIfEnabled.mockReset()
})

describe('usePositionName', () => {
  it('returns organization name when organization is present', () => {
    mockUseOrganizationIfEnabled.mockReturnValue({
      slug: 'org-one',
      name: 'Mayor',
      electedOfficeId: null,
      campaignId: 1,
    })

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('Mayor')
  })

  it('returns empty string when organization is undefined (flag off)', () => {
    mockUseOrganizationIfEnabled.mockReturnValue(undefined)

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('')
  })

  it('returns empty string when organization has no name', () => {
    mockUseOrganizationIfEnabled.mockReturnValue({
      slug: 'org-one',
      name: '',
      electedOfficeId: null,
      campaignId: 1,
    })

    const { result } = renderHook(() => usePositionName())
    expect(result.current).toBe('')
  })
})
