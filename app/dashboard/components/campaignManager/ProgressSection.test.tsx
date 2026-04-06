import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import ProgressSection from './ProgressSection'
import { CampaignContext } from '@shared/hooks/CampaignProvider'
import { VoterContactsContext } from '@shared/hooks/VoterContactsProvider'
import type { Campaign } from 'helpers/types'
import type { VoterContactsState } from '@shared/hooks/VoterContactsProvider'

vi.mock('@shared/ui/ModalOrDrawer', () => ({
  ModalOrDrawer: ({
    open,
    children,
  }: {
    open: boolean
    children: React.ReactNode
  }) => (open ? <div role="dialog">{children}</div> : null),
}))

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar: vi.fn() }),
}))

vi.mock('@styleguide', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    Card: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
    Progress: ({ value, className }: { value: number; className?: string }) => (
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className={className}
      />
    ),
  }
})

const makeCampaign = (voterContactGoal = 1000, voteGoal = 200): Campaign =>
  ({
    pathToVictory: {
      data: { voterContactGoal, voteGoal },
    },
  } as unknown as Campaign)

const makeVoterContacts = (
  overrides: Partial<VoterContactsState> = {},
): VoterContactsState => ({
  doorKnocking: 0,
  calls: 0,
  digital: 0,
  directMail: 0,
  digitalAds: 0,
  text: 0,
  events: 0,
  yardSigns: 0,
  robocall: 0,
  phoneBanking: 0,
  socialMedia: 0,
  ...overrides,
})

const renderWithProviders = (
  campaign: Campaign,
  voterContacts: VoterContactsState = makeVoterContacts(),
) =>
  render(
    <CampaignContext.Provider value={[campaign]}>
      <VoterContactsContext.Provider value={[voterContacts, vi.fn(), vi.fn()]}>
        <ProgressSection />
      </VoterContactsContext.Provider>
    </CampaignContext.Provider>,
  )

describe('ProgressSection', () => {
  it('displays formatted contacted and needed counts', () => {
    renderWithProviders(
      makeCampaign(5000),
      makeVoterContacts({ doorKnocking: 100, calls: 200 }),
    )
    expect(screen.getByText('300 voters contacted')).toBeInTheDocument()
    expect(
      screen.getByText('5,000 voter contacts needed to win'),
    ).toBeInTheDocument()
  })

  it('displays zero contacted when no voter contacts reported', () => {
    renderWithProviders(makeCampaign(1000), makeVoterContacts())
    expect(screen.getByText('0 voters contacted')).toBeInTheDocument()
  })

  it('caps progress bar at 100% when contacted exceeds needed', () => {
    renderWithProviders(
      makeCampaign(100),
      makeVoterContacts({ doorKnocking: 200 }),
    )
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.getAttribute('aria-valuenow')).toBe('100')
  })

  it('sets progress bar to 0 when needed is 0', () => {
    renderWithProviders(
      makeCampaign(0, 0),
      makeVoterContacts({ doorKnocking: 50 }),
    )
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.getAttribute('aria-valuenow')).toBe('0')
  })

  it('opens info modal when clicking the needed-to-win text', async () => {
    const user = userEvent.setup()
    renderWithProviders(makeCampaign(1000))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByText('1,000 voter contacts needed to win'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Voter contacts needed')).toBeInTheDocument()
  })

  it('closes info modal when clicking the needed-to-win text again', async () => {
    const user = userEvent.setup()
    renderWithProviders(makeCampaign(1000))

    await user.click(screen.getByText('1,000 voter contacts needed to win'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByText('1,000 voter contacts needed to win'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
