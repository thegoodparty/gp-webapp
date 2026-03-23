import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import HeaderSection from './HeaderSection'
import { UserContext } from '@shared/user/UserProvider'
import { CampaignContext } from '@shared/hooks/CampaignProvider'
import type { Campaign, User } from 'helpers/types'

vi.mock('helpers/campaignHelper', () => ({
  getNextElection: vi.fn(),
}))

vi.mock('helpers/dateHelper', async (importOriginal) => {
  const actual = await importOriginal<typeof import('helpers/dateHelper')>()
  return {
    ...actual,
    timeToNextElection: vi.fn(),
  }
})

import { getNextElection } from 'helpers/campaignHelper'
import { timeToNextElection } from 'helpers/dateHelper'
const mockGetNextElection = vi.mocked(getNextElection)
const mockTimeToNextElection = vi.mocked(timeToNextElection)

const mockUser = { firstName: 'Jane' } as User
const mockCampaign = { id: 1 } as Campaign

const renderWithProviders = () =>
  render(
    <UserContext.Provider value={[mockUser, vi.fn()]}>
      <CampaignContext.Provider value={[mockCampaign]}>
        <HeaderSection />
      </CampaignContext.Provider>
    </UserContext.Provider>,
  )

describe('HeaderSection', () => {
  it('shows general election greeting when available', () => {
    mockGetNextElection.mockReturnValue({
      nextElectionDate: '2025-11-04',
      isPrimary: false,
    })
    mockTimeToNextElection.mockReturnValue('8 weeks')
    renderWithProviders()
    expect(
      screen.getByText(/8 weeks until General Election Day, Jane/),
    ).toBeInTheDocument()
  })

  it('shows primary election greeting when primary is next', () => {
    mockGetNextElection.mockReturnValue({
      nextElectionDate: '2025-06-10',
      isPrimary: true,
    })
    mockTimeToNextElection.mockReturnValue('4 weeks')
    renderWithProviders()
    expect(
      screen.getByText(/4 weeks until Primary Election Day, Jane/),
    ).toBeInTheDocument()
  })

  it('falls back to "Hello" when timeToNextElection returns false', () => {
    mockGetNextElection.mockReturnValue({
      nextElectionDate: '2020-01-01',
      isPrimary: false,
    })
    mockTimeToNextElection.mockReturnValue(false)
    renderWithProviders()
    expect(screen.getByText(/Hello, Jane/)).toBeInTheDocument()
  })

  it('falls back to "Hello" when getNextElection returns null', () => {
    mockGetNextElection.mockReturnValue(null)
    mockTimeToNextElection.mockReturnValue(false)
    renderWithProviders()
    expect(screen.getByText(/Hello, Jane/)).toBeInTheDocument()
  })

  it('handles missing user gracefully', () => {
    mockGetNextElection.mockReturnValue(null)
    mockTimeToNextElection.mockReturnValue(false)
    render(
      <UserContext.Provider value={[null, vi.fn()]}>
        <CampaignContext.Provider value={[mockCampaign]}>
          <HeaderSection />
        </CampaignContext.Provider>
      </UserContext.Provider>,
    )
    expect(screen.getByText(/Hello,/)).toBeInTheDocument()
  })
})
