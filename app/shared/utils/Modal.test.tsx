import { render } from 'helpers/test-utils/render'
import { screen, fireEvent } from '@testing-library/react'
import Modal from '@shared/utils/Modal'

describe('Modal', () => {
  it('does not show children when closed', () => {
    render(
      <Modal open={false} closeCallback={vi.fn()}>
        <span>modal content</span>
      </Modal>,
    )
    expect(screen.queryByText('modal content')).not.toBeInTheDocument()
  })

  it('shows children when open', () => {
    render(
      <Modal open={true} closeCallback={vi.fn()}>
        <span>modal content</span>
      </Modal>,
    )
    expect(screen.getByText('modal content')).toBeInTheDocument()
  })

  it('calls closeCallback when close button is clicked', () => {
    const closeCallback = vi.fn()
    render(
      <Modal open={true} closeCallback={closeCallback}>
        <span>modal content</span>
      </Modal>,
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(closeCallback).toHaveBeenCalledTimes(1)
  })
})
