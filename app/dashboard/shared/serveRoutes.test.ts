import { describe, it, expect } from 'vitest'
import { isServeRoutePath } from './serveRoutes'

describe('isServeRoutePath', () => {
  it('matches serve route prefixes and their sub-paths', () => {
    expect(isServeRoutePath('/dashboard/briefings')).toBe(true)
    expect(isServeRoutePath('/dashboard/briefings/2026-01-15')).toBe(true)
    expect(isServeRoutePath('/dashboard/polls')).toBe(true)
    expect(isServeRoutePath('/dashboard/polls/42/expand')).toBe(true)
  })

  it('ignores query strings and hashes when matching', () => {
    expect(isServeRoutePath('/dashboard/polls?tab=open')).toBe(true)
    expect(isServeRoutePath('/dashboard/briefings#section')).toBe(true)
    expect(isServeRoutePath('/dashboard/briefings/2026-01-15?x=1#y')).toBe(true)
  })

  it('does not match non-serve routes or prefix look-alikes', () => {
    expect(isServeRoutePath('/dashboard')).toBe(false)
    expect(isServeRoutePath('/dashboard/profile')).toBe(false)
    expect(isServeRoutePath('/dashboard/briefings-archive')).toBe(false)
    expect(isServeRoutePath('/dashboard/pollsters')).toBe(false)
  })
})
