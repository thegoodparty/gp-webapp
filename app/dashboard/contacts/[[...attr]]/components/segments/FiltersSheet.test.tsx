import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import FiltersSheet from './FiltersSheet'
import { useContactsTable } from '../../hooks/ContactsTableProvider'
import { useSnackbar } from 'helpers/useSnackbar'
import { SHEET_MODES } from '../shared/constants'
import type { SegmentResponse } from '../shared/contacts-types'

vi.mock('../../hooks/ContactsTableProvider', () => ({
  useContactsTable: vi.fn(),
}))

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: vi.fn(),
}))

vi.mock('helpers/analyticsHelper', async () => {
  const actual = await vi.importActual<object>('helpers/analyticsHelper')
  return {
    ...actual,
    trackEvent: vi.fn(),
  }
})

const mockedUseContactsTable = vi.mocked(useContactsTable)
const mockedUseSnackbar = vi.mocked(useSnackbar)

type ContextValue = ReturnType<typeof useContactsTable>

function setContext(overrides: Partial<ContextValue> = {}) {
  const ctx: ContextValue = {
    filteredContacts: [],
    currentlySelectedPersonId: null,
    currentlySelectedPerson: {
      person: null,
      isLoadingPerson: false,
      isErrorPerson: false,
      issues: [],
      isLoadingIssues: false,
      isErrorIssues: false,
      issuesHasNextPage: false,
      issuesFetchNextPage: vi.fn(),
      isFetchingNextIssues: false,
      activities: [],
      isLoadingActivities: false,
      isErrorActivities: false,
      activitiesHasNextPage: false,
      activitiesFetchNextPage: vi.fn(),
      isFetchingNextActivities: false,
    },
    segments: [],
    customSegments: [],
    currentSegment: 'all',
    searchTerm: '',
    urlQueryParams: new URLSearchParams(),
    pagination: null,
    isLoading: false,
    isCustomSegment: false,
    totalSegmentContacts: 0,
    canUseProFeatures: true,
    isElectedOfficial: false,
    pageUp: vi.fn(),
    pageDown: vi.fn(),
    goToPage: vi.fn(),
    setPageSize: vi.fn(),
    selectPerson: vi.fn(),
    selectSegment: vi.fn(),
    searchContacts: vi.fn(),
    refreshCustomSegments: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
  mockedUseContactsTable.mockReturnValue(ctx)
  return ctx
}

function setSnackbar() {
  const successSnackbar = vi.fn()
  const errorSnackbar = vi.fn()
  const displaySnackbar = vi.fn()
  mockedUseSnackbar.mockReturnValue({
    successSnackbar,
    errorSnackbar,
    displaySnackbar,
  })
  return { successSnackbar, errorSnackbar }
}

const editableSegment = (
  overrides: Partial<SegmentResponse> = {},
): SegmentResponse => ({
  id: 42,
  name: 'My Saved Segment',
  genderMale: true,
  ...overrides,
})

/**
 * The filter checkboxes don't use a real <label htmlFor>; the option name
 * is rendered as a sibling div. Find the option row by its label text,
 * then return its inner checkbox.
 */
function checkboxForOption(label: string): HTMLElement {
  const labelNode = screen.getByText(new RegExp(`^${label}$`, 'i'))
  const row = labelNode.parentElement
  if (!row) throw new Error(`row for ${label} not found`)
  const checkbox = within(row).getByRole('checkbox')
  return checkbox
}

describe('<FiltersSheet>', () => {
  beforeEach(() => {
    mockedUseContactsTable.mockReset()
    mockedUseSnackbar.mockReset()
  })

  it('renders the filter sheet with section titles in create mode', () => {
    setContext()
    setSnackbar()

    render(
      <FiltersSheet
        open
        handleClose={vi.fn()}
        mode={SHEET_MODES.CREATE}
        editSegment={null}
        handleOpenChange={vi.fn()}
        resetSelect={vi.fn()}
        afterSave={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('heading', { name: /general information/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create segment/i }),
    ).toBeInTheDocument()
  })

  it('auto-generates a default segment name in create mode using the number of existing custom segments', () => {
    setContext({
      customSegments: [editableSegment({ id: 1 }), editableSegment({ id: 2 })],
    })
    setSnackbar()

    render(
      <FiltersSheet
        open
        handleClose={vi.fn()}
        mode={SHEET_MODES.CREATE}
        editSegment={null}
        handleOpenChange={vi.fn()}
        resetSelect={vi.fn()}
        afterSave={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('heading', { name: /custom segment 3/i }),
    ).toBeInTheDocument()
  })

  it('keeps the Create button disabled until a filter is selected, then triggers afterSave with the new segment id on success', async () => {
    const user = userEvent.setup()
    const afterSave = vi.fn()
    const handleClose = vi.fn()
    setContext()
    const { successSnackbar } = setSnackbar()
    api.mock('POST /v1/voters/voter-file/filter', {
      status: 200,
      data: { id: 7, name: 'Custom Segment 1' },
    })

    render(
      <FiltersSheet
        open
        handleClose={handleClose}
        mode={SHEET_MODES.CREATE}
        editSegment={null}
        handleOpenChange={vi.fn()}
        resetSelect={vi.fn()}
        afterSave={afterSave}
      />,
    )

    const create = screen.getByRole('button', { name: /create segment/i })
    expect(create).toBeDisabled()

    await user.click(checkboxForOption('Male'))
    expect(create).toBeEnabled()

    await user.click(create)

    await vi.waitFor(() => {
      expect(afterSave).toHaveBeenCalledWith(7)
    })
    expect(successSnackbar).toHaveBeenCalledWith('Segment created successfully')
    expect(handleClose).toHaveBeenCalled()
  })

  it('shows an error snackbar when the create API fails', async () => {
    const user = userEvent.setup()
    const afterSave = vi.fn()
    setContext()
    const { errorSnackbar } = setSnackbar()
    api.mock('POST /v1/voters/voter-file/filter', {
      status: 500,
      data: { message: 'server exploded' },
    })

    render(
      <FiltersSheet
        open
        handleClose={vi.fn()}
        mode={SHEET_MODES.CREATE}
        editSegment={null}
        handleOpenChange={vi.fn()}
        resetSelect={vi.fn()}
        afterSave={afterSave}
      />,
    )

    await user.click(checkboxForOption('Female'))
    await user.click(screen.getByRole('button', { name: /create segment/i }))

    await vi.waitFor(() => {
      expect(errorSnackbar).toHaveBeenCalledWith('Failed to create segment')
    })
    expect(afterSave).not.toHaveBeenCalled()
  })

  it('renders the existing name and an Update Segment button in edit mode', () => {
    setContext()
    setSnackbar()

    render(
      <FiltersSheet
        open
        handleClose={vi.fn()}
        mode={SHEET_MODES.EDIT}
        editSegment={editableSegment()}
        handleOpenChange={vi.fn()}
        resetSelect={vi.fn()}
        afterSave={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('heading', { name: /my saved segment/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /update segment/i }),
    ).toBeInTheDocument()
  })

  it('PUTs the segment, selects it, and closes the sheet when Update Segment succeeds in edit mode', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    const selectSegment = vi.fn()
    const refreshCustomSegments = vi.fn().mockResolvedValue(undefined)
    setContext({ selectSegment, refreshCustomSegments })
    const { successSnackbar } = setSnackbar()
    api.mock('PUT /v1/voters/voter-file/filter/:id', {
      status: 200,
      data: { id: 42, name: 'My Saved Segment' },
    })

    render(
      <FiltersSheet
        open
        handleClose={handleClose}
        mode={SHEET_MODES.EDIT}
        editSegment={editableSegment()}
        handleOpenChange={vi.fn()}
        resetSelect={vi.fn()}
        afterSave={vi.fn()}
      />,
    )

    // editableSegment seeds genderMale=true, so Update is enabled
    // immediately without needing a checkbox click.
    await user.click(screen.getByRole('button', { name: /update segment/i }))

    await vi.waitFor(() => {
      expect(successSnackbar).toHaveBeenCalledWith(
        'Segment updated successfully',
      )
    })
    expect(refreshCustomSegments).toHaveBeenCalled()
    expect(selectSegment).toHaveBeenCalledWith('42')
    expect(handleClose).toHaveBeenCalled()
  })

  it('shows an error snackbar and keeps the sheet open when the update API fails in edit mode', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    const selectSegment = vi.fn()
    setContext({ selectSegment })
    const { errorSnackbar } = setSnackbar()
    api.mock('PUT /v1/voters/voter-file/filter/:id', {
      status: 500,
      data: { message: 'server exploded' },
    })

    render(
      <FiltersSheet
        open
        handleClose={handleClose}
        mode={SHEET_MODES.EDIT}
        editSegment={editableSegment()}
        handleOpenChange={vi.fn()}
        resetSelect={vi.fn()}
        afterSave={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /update segment/i }))

    await vi.waitFor(() => {
      expect(errorSnackbar).toHaveBeenCalledWith('Failed to update segment')
    })
    expect(selectSegment).not.toHaveBeenCalled()
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('hides the Political Party section for elected officials', () => {
    setContext({ isElectedOfficial: true })
    setSnackbar()

    render(
      <FiltersSheet
        open
        handleClose={vi.fn()}
        mode={SHEET_MODES.CREATE}
        editSegment={null}
        handleOpenChange={vi.fn()}
        resetSelect={vi.fn()}
        afterSave={vi.fn()}
      />,
    )

    // The General Information section still renders, but its Political
    // Party field is filtered out.
    expect(
      screen.getByRole('heading', { name: /general information/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /political party/i }),
    ).not.toBeInTheDocument()
  })

  it('Select All toggles every option within a filter field on at once', async () => {
    const user = userEvent.setup()
    setContext()
    setSnackbar()

    render(
      <FiltersSheet
        open
        handleClose={vi.fn()}
        mode={SHEET_MODES.CREATE}
        editSegment={null}
        handleOpenChange={vi.fn()}
        resetSelect={vi.fn()}
        afterSave={vi.fn()}
      />,
    )

    // Scope all queries to the Gender field container (heading parent's
    // parent) — "Unknown" repeats across other filter sections.
    const genderHeading = screen.getByRole('heading', { name: /^gender$/i })
    const headerRow = genderHeading.parentElement
    const fieldContainer = headerRow?.parentElement
    if (!fieldContainer) throw new Error('gender field container not rendered')

    const selectAll = within(headerRow!).getByText(/select all/i)
    await user.click(selectAll)

    const checkboxes = within(fieldContainer).getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute('aria-checked', 'true')
    }
  })
})
