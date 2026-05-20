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

// jsdom's CSSStyleDeclaration returns `""` for `transform` and
// `undefined` for the webkit/moz variants. vaul reads them via
// `(transform || webkitTransform || mozTransform).match(...)` in drag
// handlers, which short-circuits to `undefined` and throws. Coerce all
// three to a real "none" string so vaul's regex match returns null
// instead of crashing.
if (typeof CSSStyleDeclaration !== 'undefined') {
  for (const prop of ['transform', 'webkitTransform', 'mozTransform']) {
    Object.defineProperty(CSSStyleDeclaration.prototype, prop, {
      configurable: true,
      get(): string {
        return 'none'
      },
    })
  }
}

beforeEach(() => {
  testQueryClient.clear()
})

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => router),
}))
