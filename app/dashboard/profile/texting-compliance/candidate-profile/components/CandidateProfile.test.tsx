import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import type { Website } from 'helpers/types'
import { EVENTS } from 'helpers/analyticsHelper'
import { MIN_BIO_LENGTH } from '../candidateProfile.utils'
import CandidateProfile from './CandidateProfile'

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

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar: vi.fn(), successSnackbar: vi.fn() }),
}))

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

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CandidateProfile — submit validation messaging', () => {
  it('keeps the Submit button enabled when the profile is incomplete', async () => {
    getUserWebsite.mockResolvedValue(websiteWith('', 0))
    render(<CandidateProfile />)
    expect(await screen.findByRole('button', { name: /submit/i })).toBeEnabled()
  })

  it('surfaces bio and policy-priority errors and does not save an incomplete profile', async () => {
    const user = userEvent.setup()
    getUserWebsite.mockResolvedValue(websiteWith('', 0))
    render(<CandidateProfile />)

    // Wait for the editor to mount (profile seeded) before submitting.
    await screen.findByTestId('rich-editor')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(saveAboutFields).not.toHaveBeenCalled()
    expect(screen.getByText('Please add your bio')).toBeInTheDocument()
    expect(
      screen.getByText('Please add at least one policy priority'),
    ).toBeInTheDocument()
    expect(screen.getByTestId('rich-editor')).toHaveAttribute(
      'data-error',
      'true',
    )
  })

  it('saves and navigates when the bio and a policy priority are present', async () => {
    const user = userEvent.setup()
    const validBio = 'a'.repeat(MIN_BIO_LENGTH)
    getUserWebsite.mockResolvedValue(websiteWith(validBio, 1))
    saveAboutFields.mockResolvedValue(true)
    render(<CandidateProfile />)

    // Wait for the seeded bio to reach the minimum length (editor mounted).
    await waitFor(() => expect(getUserWebsite).toHaveBeenCalled())

    await user.click(await screen.findByRole('button', { name: /submit/i }))

    await waitFor(() => expect(saveAboutFields).toHaveBeenCalledTimes(1))
    expect(saveAboutFields).toHaveBeenCalledWith(
      expect.objectContaining({
        bio: validBio,
        issues: expect.arrayContaining([
          expect.objectContaining({ title: 'Priority 1' }),
        ]),
      }),
    )
    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith('/dashboard/profile'),
    )
    expect(screen.queryByText('Please add your bio')).not.toBeInTheDocument()
  })
})

describe('CandidateProfile — bio editor mounts with no website yet (ENG-10283)', () => {
  it('renders the "Why are you running?" editor when getUserWebsite resolves to null', async () => {
    // A Pro candidate who has not created a website yet gets `null` from
    // getUserWebsite (saveAboutFields creates the website on submit). The bio
    // editor must still mount so they can fill it in — otherwise the field is
    // completely absent and the compliance flow is unfinishable.
    getUserWebsite.mockResolvedValue(null)
    render(<CandidateProfile />)

    expect(await screen.findByTestId('rich-editor')).toBeInTheDocument()
  })

  it('seeds issues to [] so submit surfaces the policy-priority error', async () => {
    // Guards the null-website seeding path: `setIssues(normalizeIssues(undefined))`
    // must produce an empty array. If it ever seeded a phantom priority, the
    // user would be silently blocked (no priority to add, yet submit fails), so
    // assert the priority error fires rather than just that the editor mounts.
    const user = userEvent.setup()
    getUserWebsite.mockResolvedValue(null)
    render(<CandidateProfile />)

    await screen.findByTestId('rich-editor')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(saveAboutFields).not.toHaveBeenCalled()
    expect(
      screen.getByText('Please add at least one policy priority'),
    ).toBeInTheDocument()
  })
})

describe('CandidateProfile — deleting a policy priority persists (ENG-10270)', () => {
  it('submits the reduced issues array after deleting a priority', async () => {
    const user = userEvent.setup()
    const validBio = 'a'.repeat(MIN_BIO_LENGTH)
    // Start with two priorities so the post-delete list still satisfies the
    // "at least one priority" requirement and Submit isn't blocked.
    getUserWebsite.mockResolvedValue(websiteWith(validBio, 2))
    saveAboutFields.mockResolvedValue(true)
    render(<CandidateProfile />)

    await waitFor(() => expect(getUserWebsite).toHaveBeenCalled())

    // Open the second priority's edit form, click Delete, then confirm in the
    // alert dialog. The edit modal unmounts on Delete, so by the confirm step
    // the only remaining "Delete" button is the alert dialog's proceed action.
    await user.click(
      await screen.findByRole('button', { name: 'Edit Priority 2' }),
    )
    await user.click(await screen.findByRole('button', { name: /^delete$/i }))
    expect(
      await screen.findByText(
        'Are you sure you want to delete this policy priority?',
      ),
    ).toBeInTheDocument()
    await user.click(await screen.findByRole('button', { name: /^delete$/i }))

    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => expect(saveAboutFields).toHaveBeenCalledTimes(1))
    // The deletion must persist: the saved array is the exact reduced list —
    // a single element that is Priority 1 only, with the removed Priority 2
    // gone. This is the regression guard for the reported "deleted priority
    // reappears" bug.
    expect(saveAboutFields).toHaveBeenCalledWith(
      expect.objectContaining({
        bio: validBio,
        issues: [expect.objectContaining({ title: 'Priority 1' })],
      }),
    )
    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith('/dashboard/profile'),
    )
  })
})

describe('CandidateProfile — funnel view event (ENG-10294)', () => {
  it('fires Candidate Profile Viewed when the step renders', async () => {
    getUserWebsite.mockResolvedValue(websiteWith('', 0))
    render(<CandidateProfile />)
    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.ProUpgrade.Compliance.CandidateProfileViewed,
      )
    })
  })
})
