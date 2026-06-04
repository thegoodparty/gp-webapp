'use client'
import { describe, it, expect } from 'vitest'
import { render } from 'helpers/test-utils/render'
import { screen, fireEvent } from '@testing-library/react'
import { SnackbarProvider, useSnackbar } from '@shared/utils/Snackbar'

const HarnessComponent = () => {
  const { successSnackbar } = useSnackbar()
  return <button onClick={() => successSnackbar('Saved!')}>Show Toast</button>
}

const ErrorHarnessComponent = () => {
  const { errorSnackbar } = useSnackbar()
  return (
    <button onClick={() => errorSnackbar('Something went wrong!')}>
      Show Error Toast
    </button>
  )
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

  it('renders an error toast when errorSnackbar is called', async () => {
    render(
      <SnackbarProvider>
        <ErrorHarnessComponent />
      </SnackbarProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show Error Toast' }))

    const toast = await screen.findByText('Something went wrong!')
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
