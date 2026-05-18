import '@testing-library/jest-dom/vitest'
import { testQueryClient } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { beforeEach, vi } from 'vitest'

if (typeof Element !== 'undefined' && !Element.prototype.setPointerCapture) {
  const noop = (): void => undefined
  Element.prototype.setPointerCapture = noop
  Element.prototype.releasePointerCapture = noop
  Element.prototype.hasPointerCapture = () => false
}

beforeEach(() => {
  testQueryClient.clear()
})

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => router),
}))
