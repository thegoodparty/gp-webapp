import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import type { Website } from 'helpers/types'
import { MIN_BIO_LENGTH } from '../candidateProfile.utils'
import CandidateProfile from './CandidateProfile'

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
  } as unknown as Website)

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
