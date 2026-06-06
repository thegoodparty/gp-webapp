import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { CommitteeSupportingFilesUpload } from './CommitteeSupportingFilesUpload'
import { clientFetch } from 'gpApi/clientFetch'

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => [{ id: 1, slug: 'jane-for-council' }],
}))

// The signed-upload-url request is the first network call the upload makes.
// Rejecting it exercises the real failure path (catch block) without S3.
vi.mock('gpApi/clientFetch', () => ({
  clientFetch: vi.fn(),
}))

const mockClientFetch = vi.mocked(clientFetch)

const choosePdf = (container: HTMLElement) => {
  const input = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement
  const file = new File(['x'], 'filing.pdf', { type: 'application/pdf' })
  fireEvent.change(input, { target: { files: [file] } })
}

describe('CommitteeSupportingFilesUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('surfaces an error message to the user when the upload fails', async () => {
    mockClientFetch.mockRejectedValue(new Error('signed url request failed'))
    const onUploadError = vi.fn()

    const { container } = render(
      <CommitteeSupportingFilesUpload onUploadError={onUploadError} />,
    )

    choosePdf(container)

    expect(await screen.findByText(/upload failed/i)).toBeInTheDocument()
    expect(onUploadError).toHaveBeenCalled()
  })
})
