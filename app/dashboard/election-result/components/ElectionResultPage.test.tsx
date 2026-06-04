import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import ElectionResultPage from './ElectionResultPage'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'

const { mockErrorSnackbar } = vi.hoisted(() => ({
  mockErrorSnackbar: vi.fn(),
}))

vi.mock('app/onboarding/shared/ajaxActions', () => ({
  updateCampaign: vi.fn(),
}))

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => [{ id: 1, details: { electionDate: '2025-05-20' } }],
}))

vi.mock('@shared/hooks/usePositionName', () => ({
  usePositionName: () => 'Mayor',
}))

vi.mock('@shared/hooks/CampaignProvider', () => ({
  CAMPAIGN_QUERY_KEY: ['campaign'],
}))

vi.mock('@shared/organization-picker', () => ({
  ORGANIZATIONS_QUERY_KEY: ['organizations'],
  useSetOrganizationSlug: () => vi.fn(),
}))

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar: mockErrorSnackbar }),
}))

vi.mock('helpers/analyticsHelper', () => ({
  EVENTS: {
    Candidacy: {
      DidYouWinModalCompleted: 'did_you_win_completed',
      DidYouWinModalViewed: 'did_you_win_viewed',
    },
  },
  trackEvent: vi.fn(),
}))

const mockUpdateCampaign = vi.mocked(updateCampaign)

const electedOfficeOrg = {
  slug: 'eo-1',
  name: null,
  positionName: null,
  position: null,
  district: null,
  electedOfficeId: 'eo-1',
  campaignId: null,
}

describe('ElectionResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not create an elected office when saving the result fails', async () => {
    mockUpdateCampaign.mockResolvedValue(false)

    let electedOfficeCreated = false
    api.mock('POST /v1/elected-office', () => {
      electedOfficeCreated = true
      return { status: 200, data: { id: 'eo-1', swornInDate: null } }
    })

    render(<ElectionResultPage />)
    fireEvent.click(screen.getByRole('button', { name: 'I won my race' }))

    await waitFor(() => {
      expect(mockErrorSnackbar).toHaveBeenCalled()
    })
    expect(electedOfficeCreated).toBe(false)
  })

  it('creates an elected office when the result is saved', async () => {
    mockUpdateCampaign.mockResolvedValue({ id: 1 } as never)

    let electedOfficeCreated = false
    api.mock('POST /v1/elected-office', () => {
      electedOfficeCreated = true
      return { status: 200, data: { id: 'eo-1', swornInDate: null } }
    })
    api.mock('GET /v1/organizations', {
      status: 200,
      data: { organizations: [electedOfficeOrg] },
    })

    render(<ElectionResultPage />)
    fireEvent.click(screen.getByRole('button', { name: 'I won my race' }))

    await waitFor(() => {
      expect(electedOfficeCreated).toBe(true)
    })
  })
})
