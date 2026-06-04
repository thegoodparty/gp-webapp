import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import type { Website } from 'helpers/types'
import { MIN_POLICY_FOCUS_LENGTH } from 'app/dashboard/profile/texting-compliance/candidate-profile/candidateProfile.utils'
import PolicyPrioritiesSection from './PolicyPrioritiesSection'

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

const websiteWithIssues = (count: number): Website =>
  ({
    content: {
      about: {
        bio: '',
        issues: Array.from({ length: count }, (_, i) => ({
          title: `Priority ${i + 1}`,
          description: `Description ${i + 1}`,
        })),
      },
    },
  }) as unknown as Website

beforeEach(() => {
  vi.clearAllMocks()
})

describe('PolicyPrioritiesSection — save validation messaging', () => {
  it('keeps the Save button enabled when there are no priorities', async () => {
    getUserWebsite.mockResolvedValue(websiteWithIssues(0))
    render(<PolicyPrioritiesSection />)
    expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled()
  })

  it('surfaces the missing-priority error and does not save when there are none', async () => {
    const user = userEvent.setup()
    getUserWebsite.mockResolvedValue(websiteWithIssues(0))
    render(<PolicyPrioritiesSection />)

    await user.click(await screen.findByRole('button', { name: /save/i }))

    expect(saveAboutFields).not.toHaveBeenCalled()
    expect(
      screen.getByText('Please add at least one policy priority'),
    ).toBeInTheDocument()
  })

  it('saves when at least one policy priority exists', async () => {
    const user = userEvent.setup()
    getUserWebsite.mockResolvedValue(websiteWithIssues(1))
    saveAboutFields.mockResolvedValue(true)
    render(<PolicyPrioritiesSection />)

    await waitFor(() => expect(getUserWebsite).toHaveBeenCalled())
    await user.click(await screen.findByRole('button', { name: /save/i }))

    await waitFor(() => expect(saveAboutFields).toHaveBeenCalledTimes(1))
    expect(saveAboutFields).toHaveBeenCalledWith({
      issues: [{ title: 'Priority 1', description: 'Description 1' }],
    })
    expect(
      screen.queryByText('Please add at least one policy priority'),
    ).not.toBeInTheDocument()
  })

  it('does not re-show the error on a later invalid edit after a successful save', async () => {
    const user = userEvent.setup()
    getUserWebsite.mockResolvedValue(websiteWithIssues(0))
    saveAboutFields.mockResolvedValue(true)
    render(<PolicyPrioritiesSection />)

    await screen.findByRole('button', { name: 'Add a policy priority' })

    // Trigger the error state.
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(
      screen.getByText('Please add at least one policy priority'),
    ).toBeInTheDocument()

    // Add a valid priority through the modal.
    await user.click(
      screen.getByRole('button', { name: 'Add a policy priority' }),
    )
    const addDialog = await screen.findByRole('dialog')
    await user.type(
      within(addDialog).getByLabelText('Policy title'),
      'Education',
    )
    fireEvent.change(within(addDialog).getByTestId('rich-editor'), {
      target: { value: 'x'.repeat(MIN_POLICY_FOCUS_LENGTH) },
    })
    await user.click(within(addDialog).getByRole('button', { name: 'Save' }))

    // Save the section successfully (resets the attempted-save flag).
    await screen.findByRole('button', { name: 'Edit Education' })
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(saveAboutFields).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled(),
    )

    // Remove the only priority to return to an invalid state.
    await user.click(screen.getByRole('button', { name: 'Edit Education' }))
    const editDialog = await screen.findByRole('dialog')
    await user.click(within(editDialog).getByRole('button', { name: 'Delete' }))
    await screen.findByText('Delete policy priority')
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    // The error must NOT reappear until the user attempts to save again.
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Edit Education' }),
      ).toBeNull(),
    )
    expect(
      screen.queryByText('Please add at least one policy priority'),
    ).not.toBeInTheDocument()
  })
})
