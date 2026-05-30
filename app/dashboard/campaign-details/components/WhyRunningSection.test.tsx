import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import type { Website } from 'helpers/types'
import { MIN_BIO_LENGTH } from 'app/dashboard/profile/texting-compliance/candidate-profile/candidateProfile.utils'
import WhyRunningSection from './WhyRunningSection'

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

const websiteWithBio = (bio: string): Website =>
  ({ content: { about: { bio, issues: [] } } } as unknown as Website)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('WhyRunningSection — save validation messaging', () => {
  it('keeps the Save button enabled when the bio is incomplete', async () => {
    getUserWebsite.mockResolvedValue(websiteWithBio(''))
    render(<WhyRunningSection />)
    expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled()
  })

  it('surfaces the bio error and does not save when the bio is empty', async () => {
    const user = userEvent.setup()
    getUserWebsite.mockResolvedValue(websiteWithBio(''))
    render(<WhyRunningSection />)

    await user.click(await screen.findByRole('button', { name: /save/i }))

    expect(saveAboutFields).not.toHaveBeenCalled()
    expect(screen.getByText('Please add your bio')).toBeInTheDocument()
    expect(screen.getByTestId('rich-editor')).toHaveAttribute(
      'data-error',
      'true',
    )
  })

  it('saves the bio when it meets the minimum length', async () => {
    const user = userEvent.setup()
    const validBio = 'a'.repeat(MIN_BIO_LENGTH)
    getUserWebsite.mockResolvedValue(websiteWithBio(validBio))
    saveAboutFields.mockResolvedValue(true)
    render(<WhyRunningSection />)

    await waitFor(() => expect(getUserWebsite).toHaveBeenCalled())
    await user.click(await screen.findByRole('button', { name: /save/i }))

    await waitFor(() => expect(saveAboutFields).toHaveBeenCalledTimes(1))
    expect(saveAboutFields).toHaveBeenCalledWith({ bio: validBio })
    expect(screen.queryByText('Please add your bio')).not.toBeInTheDocument()
  })
})
