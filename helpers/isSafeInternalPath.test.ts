import { describe, it, expect } from 'vitest'
import { isSafeInternalPath } from './isSafeInternalPath'

describe('isSafeInternalPath', () => {
  it('accepts root-relative paths', () => {
    expect(isSafeInternalPath('/dashboard/briefings')).toBe(true)
    expect(isSafeInternalPath('/dashboard/briefings/2026-01-15')).toBe(true)
    expect(isSafeInternalPath('/dashboard/polls?tab=open')).toBe(true)
    expect(isSafeInternalPath('/')).toBe(true)
  })

  it('rejects non-string values', () => {
    expect(isSafeInternalPath(null)).toBe(false)
    expect(isSafeInternalPath(undefined)).toBe(false)
    expect(isSafeInternalPath(42)).toBe(false)
  })

  it('rejects protocol-relative and absolute URLs', () => {
    expect(isSafeInternalPath('//evil.com')).toBe(false)
    expect(isSafeInternalPath('https://evil.com')).toBe(false)
    expect(isSafeInternalPath('http://evil.com/path')).toBe(false)
    expect(isSafeInternalPath('evil.com')).toBe(false)
  })

  it('rejects backslash open-redirect bypasses', () => {
    expect(isSafeInternalPath('/\\evil.com')).toBe(false)
    expect(isSafeInternalPath('/\\/evil.com')).toBe(false)
    expect(isSafeInternalPath('\\\\evil.com')).toBe(false)
  })

  it('rejects embedded whitespace/control characters', () => {
    expect(isSafeInternalPath('/\tdashboard')).toBe(false)
    expect(isSafeInternalPath('/dash board')).toBe(false)
    expect(isSafeInternalPath('/foo\n//evil.com')).toBe(false)
  })
})
