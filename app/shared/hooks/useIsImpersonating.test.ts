import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useIsImpersonating } from './useIsImpersonating'

vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '@clerk/nextjs'

describe('useIsImpersonating', () => {
  it('returns true when actor is present', () => {
    vi.mocked(useAuth).mockReturnValue({ actor: { sub: 'admin_123' } } as any)
    const { result } = renderHook(() => useIsImpersonating())
    expect(result.current).toBe(true)
  })

  it('returns false when actor is null', () => {
    vi.mocked(useAuth).mockReturnValue({ actor: null } as any)
    const { result } = renderHook(() => useIsImpersonating())
    expect(result.current).toBe(false)
  })

  it('returns false when actor is undefined', () => {
    vi.mocked(useAuth).mockReturnValue({ actor: undefined } as any)
    const { result } = renderHook(() => useIsImpersonating())
    expect(result.current).toBe(false)
  })
})
