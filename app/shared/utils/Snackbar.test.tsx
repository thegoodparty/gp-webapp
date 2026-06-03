'use client'
import { render } from 'helpers/test-utils/render'
import { screen, fireEvent } from '@testing-library/react'
import { SnackbarProvider, useSnackbar } from '@shared/utils/Snackbar'

const HarnessComponent = () => {
  const { successSnackbar } = useSnackbar()
  return <button onClick={() => successSnackbar('Saved!')}>Show Toast</button>
}

describe('SnackbarProvider + useSnackbar', () => {
  it('renders a success toast when successSnackbar is called', async () => {
    render(
      <SnackbarProvider>
        <HarnessComponent />
      </SnackbarProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))

    const toast = await screen.findByText('Saved!')
    expect(toast).toBeInTheDocument()
  })

  it('throws when useSnackbar is used outside a SnackbarProvider', () => {
    const ThrowingComponent = () => {
      useSnackbar()
      return null
    }

    expect(() => render(<ThrowingComponent />)).toThrow(
      /within a SnackbarProvider/,
    )
  })
})
