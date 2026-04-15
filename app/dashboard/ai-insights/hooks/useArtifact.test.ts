import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { clientFetch } from 'gpApi/clientFetch'
import type { ApiResponse } from 'gpApi/clientFetch'

vi.mock('gpApi/clientFetch', () => ({
  clientFetch: vi.fn(),
}))

import { useArtifact } from './useArtifact'

const mockClientFetch = clientFetch as Mock

beforeEach(() => {
  mockClientFetch.mockReset()
})

describe('useArtifact', () => {
  it('returns loading true and null artifact initially', () => {
    mockClientFetch.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useArtifact('run-123'))

    expect(result.current.loading).toBe(true)
    expect(result.current.artifact).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('returns artifact data on successful fetch', async () => {
    const artifactData = { candidate_id: 'c1', summary: { total: 100 } }
    mockClientFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      data: artifactData,
    } satisfies ApiResponse)

    const { result } = renderHook(() => useArtifact('run-456'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.artifact).toEqual(artifactData)
    expect(result.current.error).toBeNull()
  })

  it('returns error message on non-ok API response', async () => {
    mockClientFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      data: null,
    } satisfies ApiResponse)

    const { result } = renderHook(() => useArtifact('run-789'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.artifact).toBeNull()
    expect(result.current.error).toBe('Failed to load report data.')
  })

  it('returns error message on network failure', async () => {
    mockClientFetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useArtifact('run-000'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.artifact).toBeNull()
    expect(result.current.error).toBe(
      'Failed to load report data. Please try again.',
    )
  })

  it('retry re-fetches and can succeed after initial failure', async () => {
    mockClientFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useArtifact('run-retry'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.error).toBe(
      'Failed to load report data. Please try again.',
    )

    const artifactData = { candidate_id: 'c2', summary: { total: 50 } }
    mockClientFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      data: artifactData,
    } satisfies ApiResponse)

    act(() => {
      result.current.retry()
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.artifact).toEqual(artifactData)
    expect(result.current.error).toBeNull()
  })
})
