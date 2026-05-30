import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import type { Website } from 'helpers/types'
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
  } as unknown as Website)

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
})
