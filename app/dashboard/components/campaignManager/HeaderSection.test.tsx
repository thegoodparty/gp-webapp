import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import HeaderSection from './HeaderSection'
import { UserContext } from '@shared/user/UserProvider'
import { CampaignContext } from '@shared/hooks/CampaignProvider'
import type { Campaign, User } from 'helpers/types'

vi.mock('helpers/dateHelper', async (importOriginal) => {
  const actual = await importOriginal<typeof import('helpers/dateHelper')>()
  return {
    ...actual,
    timeToNextElection: vi.fn(),
  }
})

import { timeToNextElection } from 'helpers/dateHelper'
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
  it('shows time-to-election greeting when available', () => {
    mockTimeToNextElection.mockReturnValue('8 weeks away')
    renderWithProviders()
    expect(screen.getByText(/8 weeks away, Jane/)).toBeInTheDocument()
  })

  it('falls back to "Hello" when timeToNextElection returns false', () => {
    mockTimeToNextElection.mockReturnValue(false)
    renderWithProviders()
    expect(screen.getByText(/Hello, Jane/)).toBeInTheDocument()
  })

  it('handles missing user gracefully', () => {
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
