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

const makeCampaign = (winNumber = 1000): Campaign =>
  ({
    raceTargetMetrics: {
      projectedTurnout: 0,
      winNumber,
      voterContactGoal: winNumber * 5,
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
  it('displays likely votes (contacts / 5) and the win number needed', () => {
    renderWithProviders(
      makeCampaign(1000),
      makeVoterContacts({ doorKnocking: 100, calls: 200 }),
    )
    // 300 contacts ÷ 5 = 60 likely votes
    expect(screen.getByText('60 likely votes')).toBeInTheDocument()
    expect(
      screen.getByText('1,000 likely votes needed to win'),
    ).toBeInTheDocument()
  })

  it('displays zero likely votes when no voter contacts reported', () => {
    renderWithProviders(makeCampaign(1000), makeVoterContacts())
    expect(screen.getByText('0 likely votes')).toBeInTheDocument()
  })

  it('caps progress bar at 100% when likely votes exceed needed', () => {
    // 5 contacts → 1 likely vote; needed = 1 → progress hits 100% at 5 contacts.
    renderWithProviders(
      makeCampaign(1),
      makeVoterContacts({ doorKnocking: 1000 }),
    )
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.getAttribute('aria-valuenow')).toBe('100')
  })

  it('sets progress bar to 0 when needed is 0', () => {
    renderWithProviders(
      makeCampaign(0),
      makeVoterContacts({ doorKnocking: 50 }),
    )
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.getAttribute('aria-valuenow')).toBe('0')
  })

  it('opens info modal when clicking the needed-to-win text', async () => {
    const user = userEvent.setup()
    renderWithProviders(makeCampaign(1000))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByText('1,000 likely votes needed to win'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getAllByText('Projected votes needed to win').length,
    ).toBeGreaterThan(0)
  })

  it('closes info modal when clicking the needed-to-win text again', async () => {
    const user = userEvent.setup()
    renderWithProviders(makeCampaign(1000))

    await user.click(screen.getByText('1,000 likely votes needed to win'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByText('1,000 likely votes needed to win'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
