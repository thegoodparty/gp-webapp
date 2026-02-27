import '@testing-library/jest-dom/vitest'
import { queryClient } from '@shared/query-client'
import { router } from 'helpers/test-utils/router-mocking'
import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  queryClient.clear()
})

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => router),
}))
