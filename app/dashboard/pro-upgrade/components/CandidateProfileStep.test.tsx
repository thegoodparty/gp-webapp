import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import type { Website } from 'helpers/types'
import { EVENTS } from 'helpers/analyticsHelper'
import { MIN_BIO_LENGTH } from 'app/dashboard/profile/texting-compliance/candidate-profile/candidateProfile.utils'
import CandidateProfileStep from './CandidateProfileStep'
import { useProUpgradeWizard } from './ProUpgradeWizard'

vi.mock('./ProUpgradeWizard', () => ({
  useProUpgradeWizard: vi.fn(),
}))

const mockTrackEvent = vi.fn()
vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('helpers/analyticsHelper')>()
  return {
    ...actual,
    trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
  }
})

vi.mock('app/shared/utils/RichEditor', async () => ({
  default: (await import('helpers/test-utils/RichEditorMock')).RichEditorMock,
}))

const { getUserWebsite, saveAboutFields } = vi.hoisted(() => ({
  getUserWebsite: vi.fn(),
  saveAboutFields: vi.fn(),
}))

vi.mock('app/dashboard/website/util/website.util', () => ({
  USER_WEBSITE_QUERY_KEY: ['user-website'],
  getUserWebsite,
  saveAboutFields,
}))

const errorSnackbar = vi.fn()
vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar, successSnackbar: vi.fn() }),
}))

const mockUseProUpgradeWizard = vi.mocked(useProUpgradeWizard)
const goToNextStep = vi.fn()

const websiteWith = (bio: string, issueCount: number): Website =>
  ({
    content: {
      about: {
        bio,
        issues: Array.from({ length: issueCount }, (_, i) => ({
          title: `Priority ${i + 1}`,
          description: 'y'.repeat(MIN_BIO_LENGTH),
        })),
      },
    },
  }) as unknown as Website

const validBio = 'a'.repeat(MIN_BIO_LENGTH)

beforeEach(() => {
  vi.clearAllMocks()
  mockUseProUpgradeWizard.mockReturnValue({
    currentStep: 'candidate-profile',
    goToStep: vi.fn(),
    goToNextStep,
    goToPreviousStep: vi.fn(),
  })
  // Default: a complete profile on file, save succeeds.
  getUserWebsite.mockResolvedValue(websiteWith(validBio, 1))
  saveAboutFields.mockResolvedValue(true)
})

describe('CandidateProfileStep', () => {
  it('fires the candidate-profile viewed event on mount', async () => {
    render(<CandidateProfileStep />)
    await waitFor(() =>
      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.ProUpgrade.Compliance.CandidateProfileViewed,
      ),
    )
  })

  it('renders the bio editor, policy priorities, and a Continue button', async () => {
    render(<CandidateProfileStep />)
    expect(await screen.findByTestId('rich-editor')).toBeInTheDocument()
    expect(screen.getByText('Your policy priorities')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
  })

  it('saves bio and issues and advances to payment on a valid submit', async () => {
    const user = userEvent.setup()
    render(<CandidateProfileStep />)

    await waitFor(() => expect(getUserWebsite).toHaveBeenCalled())
    await screen.findByTestId('rich-editor')

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(saveAboutFields).toHaveBeenCalledTimes(1))
    expect(saveAboutFields).toHaveBeenCalledWith(
      expect.objectContaining({
        bio: validBio,
        issues: expect.arrayContaining([
          expect.objectContaining({ title: 'Priority 1' }),
        ]),
      }),
    )
    // Advance is the AC: on success the step moves to the payment step.
    await waitFor(() => expect(goToNextStep).toHaveBeenCalledTimes(1))
    expect(errorSnackbar).not.toHaveBeenCalled()
  })

  it('blocks advance and surfaces validation messaging for an under-length bio / no priorities', async () => {
    const user = userEvent.setup()
    // Empty bio (< 500 chars) and zero policy priorities.
    getUserWebsite.mockResolvedValue(websiteWith('', 0))
    render(<CandidateProfileStep />)

    await screen.findByTestId('rich-editor')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(saveAboutFields).not.toHaveBeenCalled()
    expect(goToNextStep).not.toHaveBeenCalled()
    expect(screen.getByText('Please add your bio')).toBeInTheDocument()
    expect(
      screen.getByText('Please add at least one policy priority'),
    ).toBeInTheDocument()
    expect(screen.getByTestId('rich-editor')).toHaveAttribute(
      'data-error',
      'true',
    )
  })

  it('does not advance and shows an error when the save fails', async () => {
    // saveAboutFields resolves false on an API failure; advancing anyway would
    // strand an un-persisted profile (the next step would derive incomplete).
    const user = userEvent.setup()
    saveAboutFields.mockResolvedValue(false)
    render(<CandidateProfileStep />)

    await waitFor(() => expect(getUserWebsite).toHaveBeenCalled())
    await screen.findByTestId('rich-editor')

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(saveAboutFields).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(errorSnackbar).toHaveBeenCalled())
    expect(goToNextStep).not.toHaveBeenCalled()
  })
})
