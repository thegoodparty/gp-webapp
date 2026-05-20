import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClientConfig } from '@shared/query-client'
import { render as _render, RenderOptions } from '@testing-library/react'

export const testQueryClient = new QueryClient(queryClientConfig)

const TestProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  )
}

export const render = (
  ui: React.ReactNode,
  options?: Omit<RenderOptions, 'queries' | 'wrapper'> | undefined,
) => _render(ui, { ...options, wrapper: TestProvider })
