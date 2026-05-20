/**
 * Shared utilities for the localStorage-backed stubs.
 *
 * Used by annotations-stub.ts and chat-stub.ts. Server contexts get the
 * `safeStorage() === null` short-circuit so the same modules can be
 * imported from server components without crashing.
 */

export function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function newId(prefix: string): string {
  return (
    prefix +
    '_' +
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  )
}

export function nowIso(): string {
  return new Date().toISOString()
}
