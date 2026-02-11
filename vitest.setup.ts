import '@testing-library/jest-dom/vitest'
import { router } from 'helpers/test-utils/router-mocking'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => router),
}))
