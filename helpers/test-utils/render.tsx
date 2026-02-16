import { queryClient } from '@shared/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { render as _render, RenderOptions } from '@testing-library/react'
import { beforeEach } from 'vitest'

const TestProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

beforeEach(() => {
  queryClient.clear()
})

export const render = (
  ui: React.ReactNode,
  options?: Omit<RenderOptions, 'queries' | 'wrapper'> | undefined,
) => _render(ui, { ...options, wrapper: TestProvider })
