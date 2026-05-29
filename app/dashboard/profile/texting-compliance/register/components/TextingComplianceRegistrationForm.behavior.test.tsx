import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { FormDataProvider, type FormDataState } from '@shared/hooks/useFormData'
import TextingComplianceRegistrationForm, {
  validateRegistrationForm,
} from './TextingComplianceRegistrationForm'

// Mock only the external Google Places dependency so AddressAutocomplete
// renders its real input without loading the Maps script.
vi.mock('react-google-autocomplete', () => ({
  usePlacesWidget: () => ({ ref: { current: null } }),
}))

const validInitialState = (
  overrides: Partial<FormDataState> = {},
): FormDataState => ({
  electionFilingLink: 'https://example.gov/filings/123',
  campaignCommitteeName: 'Jane for Council',
  officeLevel: 'local',
  ein: '12-3456789',
  phone: '5555550123',
  address: { formatted_address: '123 Main St', place_id: 'abc' },
  website: '',
  email: 'jane@example.com',
  ...overrides,
})

type SubmitMock = ReturnType<typeof vi.fn<(formData: FormDataState) => void>>

const renderForm = (
  initialState: FormDataState,
  onSubmit: SubmitMock = vi.fn<(formData: FormDataState) => void>(),
  requireWebsite = false,
): SubmitMock => {
  render(
    <FormDataProvider
      initialState={initialState}
      validator={(d) => validateRegistrationForm(d, { requireWebsite })}
    >
      <TextingComplianceRegistrationForm
        onSubmit={onSubmit}
        requireWebsite={requireWebsite}
      />
    </FormDataProvider>,
  )
  return onSubmit
}

beforeEach(() => {
  // jsdom does not implement scrollTo; the invalid-submit path calls it.
  window.scrollTo = vi.fn()
})

describe('TextingComplianceRegistrationForm — submit behavior', () => {
  it('keeps the Submit button enabled even when the form is invalid', () => {
    renderForm({})
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled()
  })

  it('does not submit an invalid form and surfaces guiding errors', async () => {
    const user = userEvent.setup()
    const onSubmit = renderForm({})

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(
      screen.getByText(/please fix the following fields/i),
    ).toBeInTheDocument()
    // Field-specific guidance (only rendered in the error banner) is shown.
    expect(screen.getByText(/select an option/i)).toBeInTheDocument()
    // The invalid field is marked with MUI's error styling.
    expect(document.querySelector('.Mui-error')).not.toBeNull()
  })

  it('submits the (non-federal) form when it is valid', async () => {
    const user = userEvent.setup()
    const onSubmit = renderForm(validInitialState())

    const button = screen.getByRole('button', { name: /submit/i })
    expect(button).toBeEnabled()
    await user.click(button)

    expect(onSubmit).toHaveBeenCalledTimes(1)
    // Non-federal: committeeType is defaulted to CANDIDATE.
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        campaignCommitteeName: 'Jane for Council',
        committeeType: 'CANDIDATE',
      }),
    )
    // No error banner when the form is valid.
    expect(
      screen.queryByText(/please fix the following fields/i),
    ).toBeNull()
  })

  it('never lists `website` in the banner, even when requireWebsite is true', async () => {
    const user = userEvent.setup()
    // requireWebsite=true makes an empty website invalid, but this form renders
    // no website input, so it must not appear in the banner. Email is also left
    // empty so the banner has a real, fixable field to show.
    const onSubmit = renderForm(
      validInitialState({ website: '', email: '' }),
      undefined,
      true,
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(
      screen.getByText(/please fix the following fields/i),
    ).toBeInTheDocument()
    // The fixable field's guidance is shown...
    expect(
      screen.getByText(/valid email address as it appears/i),
    ).toBeInTheDocument()
    // ...but `website` (no input here) is not — neither its name nor message.
    expect(screen.queryByText('Valid URL')).toBeNull()
  })
})
