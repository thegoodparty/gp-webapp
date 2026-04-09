import type { ChangeEvent, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import LogTaskModal from './LogTaskModal'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { identifyUser } from '@shared/utils/analytics'

const mockUseVoterContacts = vi.fn()
const mockUseUser = vi.fn()

vi.mock('@shared/hooks/useVoterContacts', () => ({
  useVoterContacts: () => mockUseVoterContacts(),
}))

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}))

vi.mock('@shared/utils/Modal', () => ({
  default: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div role="dialog">{children}</div> : null,
}))

vi.mock('@shared/inputs/TextField', () => ({
  default: ({
    label,
    onChange,
    value,
    type,
  }: {
    label: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    value?: string
    type?: string
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        onChange={onChange}
        value={value ?? ''}
        type={type}
      />
    </label>
  ),
}))

vi.mock('@shared/typography/H1', () => ({
  default: ({ children }: { children: ReactNode }) => <h1>{children}</h1>,
}))

vi.mock('@shared/buttons/Button', () => ({
  default: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode
    onClick?: () => void
    disabled?: boolean
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))

vi.mock('helpers/analyticsHelper', () => ({
  trackEvent: vi.fn(),
  buildTrackingAttrs: vi.fn(() => ({})),
  EVENTS: {
    Dashboard: {
      CampaignPlan: {
        VoterContactDialogViewed: 'Dashboard - Voter Contact Dialog Viewed',
        VoterContactRecorded: 'Dashboard - Voter Contact Recorded',
      },
      VoterContact: {
        CampaignCompleted: 'dashboard.voterContact.campaignCompleted',
      },
    },
  },
}))

vi.mock('@shared/utils/analytics', () => ({
  identifyUser: vi.fn(() => Promise.resolve(true)),
}))

const mockTrackEvent = vi.mocked(trackEvent)
const mockIdentifyUser = vi.mocked(identifyUser)

beforeEach(() => {
  vi.clearAllMocks()
  mockUseUser.mockReturnValue([{ id: 'user-1' }, vi.fn()])
  mockUseVoterContacts.mockReturnValue([
    {
      text: 3,
      robocall: 0,
      doorKnocking: 0,
      phoneBanking: 0,
      socialMedia: 0,
      events: 1,
    },
    vi.fn(),
  ])
})

describe('LogTaskModal tracking', () => {
  it('fires VoterContactDialogViewed on mount when campaign plan tracking is enabled', () => {
    render(
      <LogTaskModal
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        flowType="text"
        trackCampaignPlanEvents
      />,
    )

    expect(mockTrackEvent).toHaveBeenCalledWith(
      EVENTS.Dashboard.CampaignPlan.VoterContactDialogViewed,
      { taskType: 'text' },
    )
  })

  it('does NOT fire VoterContactDialogViewed when campaign plan tracking is disabled', () => {
    render(
      <LogTaskModal onSubmit={vi.fn()} onClose={vi.fn()} flowType="text" />,
    )

    expect(mockTrackEvent).not.toHaveBeenCalledWith(
      EVENTS.Dashboard.CampaignPlan.VoterContactDialogViewed,
      expect.anything(),
    )
  })

  it('fires CampaignCompleted analytics on submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <LogTaskModal
        onSubmit={onSubmit}
        onClose={vi.fn()}
        flowType="text"
        trackCampaignPlanEvents
      />,
    )

    await user.type(screen.getByLabelText('Text Messages Scheduled'), '5')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(5)
    })

    expect(mockTrackEvent).toHaveBeenCalledWith(
      EVENTS.Dashboard.VoterContact.CampaignCompleted,
      expect.objectContaining({
        recipientCount: 5,
        medium: 'text',
      }),
    )
  })

  it('fires VoterContactRecorded tracking event on submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <LogTaskModal
        onSubmit={onSubmit}
        onClose={vi.fn()}
        flowType="text"
        trackCampaignPlanEvents
      />,
    )

    await user.type(screen.getByLabelText('Text Messages Scheduled'), '5')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(5)
    })

    expect(mockTrackEvent).toHaveBeenCalledWith(
      EVENTS.Dashboard.CampaignPlan.VoterContactRecorded,
      {
        taskType: 'text',
        recipientCount: 5,
      },
    )
  })

  it('identifies the user with updated voter contacts on submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <LogTaskModal
        onSubmit={onSubmit}
        onClose={vi.fn()}
        flowType="text"
        trackCampaignPlanEvents
      />,
    )

    await user.type(screen.getByLabelText('Text Messages Scheduled'), '5')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(5)
    })

    expect(mockIdentifyUser).toHaveBeenCalledWith('user-1', {
      voterContacts: 9,
    })
  })
})
