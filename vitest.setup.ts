import '@testing-library/jest-dom/vitest'
import { testQueryClient } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  testQueryClient.clear()
})

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => router),
}))
