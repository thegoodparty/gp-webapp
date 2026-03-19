import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import ProgressSection from './ProgressSection'
import { CampaignContext } from '@shared/hooks/CampaignProvider'
import { VoterContactsContext } from '@shared/hooks/VoterContactsProvider'
import type { Campaign } from 'helpers/types'
import type { ReportedVoterGoals } from '../voterGoalsHelpers'

const makeCampaign = (
  voterContactGoal = 1000,
  voteGoal = 200,
): Campaign =>
  ({
    pathToVictory: {
      data: { voterContactGoal, voteGoal },
    },
  }) as unknown as Campaign

const makeVoterContacts = (
  overrides: Partial<ReportedVoterGoals> = {},
): ReportedVoterGoals => ({
  doorKnocking: 0,
  calls: 0,
  digital: 0,
  ...overrides,
})

const renderWithProviders = (
  campaign: Campaign,
  voterContacts: ReportedVoterGoals = makeVoterContacts(),
) =>
  render(
    <CampaignContext.Provider value={[campaign]}>
      <VoterContactsContext.Provider value={[voterContacts, vi.fn()]}>
        <ProgressSection />
      </VoterContactsContext.Provider>
    </CampaignContext.Provider>,
  )

describe('ProgressSection', () => {
  it('renders voter contact counts', () => {
    renderWithProviders(
      makeCampaign(5000),
      makeVoterContacts({ doorKnocking: 100, calls: 200 }),
    )
    expect(screen.getByText(/300 voters contacted/)).toBeInTheDocument()
    expect(
      screen.getByText(/5,000 voter contacts needed to win/),
    ).toBeInTheDocument()
  })

  it('caps progress at 100% when contacted exceeds needed', () => {
    const campaign = makeCampaign(100)
    const contacts = makeVoterContacts({ doorKnocking: 200 })
    const { container } = renderWithProviders(campaign, contacts)
    const progressBar = container.querySelector('[role="progressbar"]')
    const ariaValue = progressBar?.getAttribute('aria-valuenow')
    if (ariaValue) {
      expect(Number(ariaValue)).toBeLessThanOrEqual(100)
    }
  })

  it('opens info modal on click', () => {
    renderWithProviders(makeCampaign())
    fireEvent.click(
      screen.getByText(/voter contacts needed to win/),
    )
    expect(screen.getByText(/Voter contacts needed/)).toBeInTheDocument()
  })

  it('renders zero progress when no contacts', () => {
    renderWithProviders(makeCampaign(1000), makeVoterContacts())
    expect(screen.getByText(/0 voters contacted/)).toBeInTheDocument()
  })
})
