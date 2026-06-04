import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import ElectionOver from './ElectionOver'

const mockUseCampaign = vi.fn()

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => mockUseCampaign(),
}))

const DEBRIEF_COPY = 'Contact us for a debrief about how the election went.'
const CONSOLATION_COPY =
  "You ran a great race, sorry you didn't come out on top"
const DEBRIEF_BUTTON = 'Contact us for a debrief'

describe('ElectionOver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the consolation copy and hides the debrief button for non-pro campaigns', () => {
    mockUseCampaign.mockReturnValue([{ id: 'campaign-1', isPro: false }])

    render(<ElectionOver />)

    expect(screen.getByText(CONSOLATION_COPY)).toBeInTheDocument()
    expect(screen.queryByText(DEBRIEF_COPY)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: DEBRIEF_BUTTON }),
    ).not.toBeInTheDocument()
  })

  it('shows the debrief copy and button for pro campaigns', () => {
    mockUseCampaign.mockReturnValue([{ id: 'campaign-1', isPro: true }])

    render(<ElectionOver />)

    expect(screen.getByText(DEBRIEF_COPY)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: DEBRIEF_BUTTON }),
    ).toBeInTheDocument()
    expect(screen.queryByText(CONSOLATION_COPY)).not.toBeInTheDocument()
  })
})
