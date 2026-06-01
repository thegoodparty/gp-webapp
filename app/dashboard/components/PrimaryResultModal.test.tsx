import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import PrimaryResultModal from './PrimaryResultModal'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'

vi.mock('app/onboarding/shared/ajaxActions', () => ({
  updateCampaign: vi.fn().mockResolvedValue({ id: 1 }),
}))

vi.mock('helpers/analyticsHelper', () => ({
  EVENTS: { Candidacy: { CampaignCompleted: 'campaign_completed' } },
  trackEvent: vi.fn(),
}))

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar: vi.fn() }),
}))

vi.mock('@shared/animations/PartyAnimation', () => ({
  default: () => null,
}))

const mockUpdateCampaign = vi.mocked(updateCampaign)

const optionLabel = { won: 'I won my race', lost: 'I did not win my race' }

describe('PrimaryResultModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each(['won', 'lost'] as const)(
    'submits the selection with the top-level primaryResult key (%s)',
    async (result) => {
      render(
        <PrimaryResultModal
          open
          officeName="Mayor"
          electionDate="2026-11-03"
          onClose={vi.fn()}
        />,
      )

      fireEvent.click(screen.getByText(optionLabel[result]))
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(mockUpdateCampaign).toHaveBeenCalledWith([
          { key: 'primaryResult', value: result },
        ])
      })
    },
  )
})
