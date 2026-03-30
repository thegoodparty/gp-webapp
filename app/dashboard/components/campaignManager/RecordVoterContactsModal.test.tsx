import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { RecordVoterContactsModal } from './RecordVoterContactsModal'
import { UserContext } from '@shared/user/UserProvider'
import { VoterContactsContext } from '@shared/hooks/VoterContactsProvider'
import { CampaignUpdateHistoryContext } from '@shared/hooks/CampaignUpdateHistoryProvider'
import type { User } from 'helpers/types'
import type { VoterContactsState } from '@shared/hooks/VoterContactsProvider'
import type { CampaignUpdateHistoryWithUser } from '@shared/hooks/CampaignUpdateHistoryProvider'

vi.mock('@shared/ui/ModalOrDrawer', () => ({
  ModalOrDrawer: ({
    open,
    children,
  }: {
    open: boolean
    children: React.ReactNode
  }) => (open ? <div role="dialog">{children}</div> : null),
}))

vi.mock('@shared/utils/campaignUpdateHistoryServices', () => ({
  createUpdateHistory: vi.fn(),
  createIrresponsiblyMassagedHistoryItem: vi.fn(),
}))

vi.mock('helpers/analyticsHelper', () => ({
  trackEvent: vi.fn(),
  buildTrackingAttrs: vi.fn(() => ({})),
  EVENTS: {
    Dashboard: {
      VoterContact: {
        CampaignCompleted: 'dashboard.voterContact.campaignCompleted',
      },
    },
  },
}))

vi.mock('@shared/utils/analytics', () => ({
  identifyUser: vi.fn(() => Promise.resolve(true)),
}))

const mockErrorSnackbar = vi.fn()
vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar: mockErrorSnackbar }),
}))

import {
  createUpdateHistory,
  createIrresponsiblyMassagedHistoryItem,
} from '@shared/utils/campaignUpdateHistoryServices'
import { trackEvent } from 'helpers/analyticsHelper'
import { identifyUser } from '@shared/utils/analytics'

const mockCreateUpdateHistory = vi.mocked(createUpdateHistory)
const mockMassageHistoryItem = vi.mocked(createIrresponsiblyMassagedHistoryItem)
const mockTrackEvent = vi.mocked(trackEvent)
const mockIdentifyUser = vi.mocked(identifyUser)

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    ...overrides,
  } as User)

const EMPTY_VOTER_CONTACTS: VoterContactsState = {
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
}

const mockSetVoterContacts = vi.fn(() => Promise.resolve())
const mockSetUpdateHistory = vi.fn()
const mockSetOpen = vi.fn()

const renderModal = ({
  open = true,
  user = makeUser(),
  voterContacts = EMPTY_VOTER_CONTACTS,
  updateHistory = [] as CampaignUpdateHistoryWithUser[],
}: {
  open?: boolean
  user?: User | null
  voterContacts?: VoterContactsState
  updateHistory?: CampaignUpdateHistoryWithUser[]
} = {}) =>
  render(
    <UserContext.Provider value={[user, vi.fn(), false]}>
      <VoterContactsContext.Provider
        value={[voterContacts, mockSetVoterContacts]}
      >
        <CampaignUpdateHistoryContext.Provider
          value={[updateHistory, mockSetUpdateHistory]}
        >
          <RecordVoterContactsModal open={open} setOpen={mockSetOpen} />
        </CampaignUpdateHistoryContext.Provider>
      </VoterContactsContext.Provider>
    </UserContext.Provider>,
  )

beforeEach(() => {
  vi.clearAllMocks()
  mockCreateUpdateHistory.mockResolvedValue({
    id: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    campaignId: 1,
    userId: 1,
    type: 'text',
    quantity: 10,
  })
  mockMassageHistoryItem.mockImplementation((item, user) => ({
    ...item,
    user: {
      id: user.id as number,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
    },
  }))
})

describe('RecordVoterContactsModal', () => {
  it('renders all six contact type fields when open', () => {
    renderModal()
    expect(
      screen.getByText('How many voters did you contact?'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Text Messages Sent')).toBeInTheDocument()
    expect(screen.getByLabelText('Robocalls Sent')).toBeInTheDocument()
    expect(screen.getByLabelText('Doors Knocked')).toBeInTheDocument()
    expect(screen.getByLabelText('Calls Made')).toBeInTheDocument()
    expect(screen.getByLabelText('Social Post Views')).toBeInTheDocument()
    expect(screen.getByLabelText('Voters Met At Events')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    renderModal({ open: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('disables save button when all fields are empty', () => {
    renderModal()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('enables save button when a field has a positive value', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByLabelText('Text Messages Sent'), '5')
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })

  it('accepts typed input into a contact field', async () => {
    const user = userEvent.setup()
    renderModal()
    const textField = screen.getByLabelText('Text Messages Sent')
    await user.type(textField, '42')
    expect(textField).toHaveValue(42)
  })

  it('submits entered contacts and calls createUpdateHistory per field', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByLabelText('Text Messages Sent'), '10')
    await user.type(screen.getByLabelText('Doors Knocked'), '5')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockCreateUpdateHistory).toHaveBeenCalledTimes(2)
    })

    expect(mockCreateUpdateHistory).toHaveBeenCalledWith({
      type: 'text',
      quantity: 10,
    })
    expect(mockCreateUpdateHistory).toHaveBeenCalledWith({
      type: 'doorKnocking',
      quantity: 5,
    })
  })

  it('updates voter contacts state and closes modal on submit', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByLabelText('Text Messages Sent'), '10')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockSetVoterContacts).toHaveBeenCalledWith(
        expect.objectContaining({ text: 10 }),
      )
    })
    expect(mockSetUpdateHistory).toHaveBeenCalled()
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it('increments existing voter contact totals rather than replacing', async () => {
    const user = userEvent.setup()
    renderModal({
      voterContacts: { ...EMPTY_VOTER_CONTACTS, text: 50 },
    })

    await user.type(screen.getByLabelText('Text Messages Sent'), '10')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockSetVoterContacts).toHaveBeenCalledWith(
        expect.objectContaining({ text: 60 }),
      )
    })
  })

  it('tracks analytics events for each non-zero contact type', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByLabelText('Robocalls Sent'), '20')
    await user.type(screen.getByLabelText('Calls Made'), '15')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledTimes(2)
    })

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'dashboard.voterContact.campaignCompleted',
      expect.objectContaining({ medium: 'robocall', recipientCount: 20 }),
    )
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'dashboard.voterContact.campaignCompleted',
      expect.objectContaining({ medium: 'phoneBanking', recipientCount: 15 }),
    )
  })

  it('calls identifyUser with total contacts on submit', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByLabelText('Text Messages Sent'), '10')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockIdentifyUser).toHaveBeenCalledWith(1, {
        voterContacts: 10,
      })
    })
  })

  it('does not submit history for empty fields', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByLabelText('Doors Knocked'), '3')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockCreateUpdateHistory).toHaveBeenCalledTimes(1)
    })

    expect(mockCreateUpdateHistory).toHaveBeenCalledWith({
      type: 'doorKnocking',
      quantity: 3,
    })
  })

  it('skips identifyUser when no user is present', async () => {
    mockCreateUpdateHistory.mockReset()
    renderModal({ user: null })

    expect(mockIdentifyUser).not.toHaveBeenCalled()
  })
})
