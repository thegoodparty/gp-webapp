import { NextRouter } from 'next/router'
import { Mocked, vi } from 'vitest'

export const router: Partial<Mocked<NextRouter>> = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
}
