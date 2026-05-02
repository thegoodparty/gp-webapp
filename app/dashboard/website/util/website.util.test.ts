import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiRoutes } from 'gpApi/routes'
import type { Website } from 'helpers/types'
import { saveAboutFields } from './website.util'

const mockClientFetch = vi.fn()

vi.mock('gpApi/clientFetch', () => ({
  clientFetch: (...args: unknown[]) => mockClientFetch(...args),
}))

const okResponse = <T>(data: T) => ({
  ok: true,
  status: 200,
  statusText: 'OK',
  data,
})

const errorResponse = () => ({
  ok: false,
  status: 500,
  statusText: 'Server Error',
  data: undefined,
})

const buildWebsite = (
  about: NonNullable<Website['content']>['about'] = {},
): Website => ({
  id: 1,
  vanityPath: 'jane-doe',
  status: 'unpublished',
  content: { about },
  domain: null,
})

const flush = async () => {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

describe('saveAboutFields', () => {
  beforeEach(() => {
    mockClientFetch.mockReset()
  })

  it('fetches the latest server state, then updates with the merged about', async () => {
    const latest = buildWebsite({
      bio: 'old bio',
      issues: [{ title: 'Healthcare', description: 'Universal' }],
      committee: 'Friends of Jane',
    })
    mockClientFetch
      .mockResolvedValueOnce(okResponse(latest))
      .mockResolvedValueOnce(okResponse(latest))

    const result = await saveAboutFields({ bio: 'new bio' })

    expect(result).toBe(true)
    expect(mockClientFetch).toHaveBeenCalledTimes(2)
    expect(mockClientFetch).toHaveBeenNthCalledWith(1, apiRoutes.website.get)
    expect(mockClientFetch).toHaveBeenNthCalledWith(
      2,
      apiRoutes.website.update,
      {
        about: {
          bio: 'new bio',
          issues: [{ title: 'Healthcare', description: 'Universal' }],
          committee: 'Friends of Jane',
        },
      },
    )
  })

  it('returns false when update fails and does not throw', async () => {
    mockClientFetch
      .mockResolvedValueOnce(okResponse(buildWebsite({ bio: 'old' })))
      .mockResolvedValueOnce(errorResponse())

    const result = await saveAboutFields({ bio: 'new' })

    expect(result).toBe(false)
    expect(mockClientFetch).toHaveBeenCalledTimes(2)
  })

  it('returns false when the update call rejects', async () => {
    mockClientFetch
      .mockResolvedValueOnce(okResponse(buildWebsite({ bio: 'old' })))
      .mockRejectedValueOnce(new Error('network down'))

    const result = await saveAboutFields({ bio: 'new' })

    expect(result).toBe(false)
  })

  it('returns false when the get call rejects (queue is not poisoned)', async () => {
    mockClientFetch.mockRejectedValueOnce(new Error('network down'))

    const result = await saveAboutFields({ bio: 'new' })

    expect(result).toBe(false)

    // Subsequent calls still work.
    mockClientFetch
      .mockResolvedValueOnce(okResponse(buildWebsite()))
      .mockResolvedValueOnce(okResponse(buildWebsite()))

    const next = await saveAboutFields({ bio: 'recovered' })
    expect(next).toBe(true)
  })

  it('treats null content the same as no about', async () => {
    const latest = {
      id: 1,
      vanityPath: 'jane-doe',
      status: 'unpublished',
      content: null,
      domain: null,
    } as Website
    mockClientFetch
      .mockResolvedValueOnce(okResponse(latest))
      .mockResolvedValueOnce(okResponse(latest))

    const result = await saveAboutFields({ bio: 'new' })

    expect(result).toBe(true)
    expect(mockClientFetch).toHaveBeenNthCalledWith(
      2,
      apiRoutes.website.update,
      {
        about: { bio: 'new' },
      },
    )
  })

  it('overwrites a sibling field already present in the latest about', async () => {
    const latest = buildWebsite({
      bio: 'first',
      issues: [{ title: 'A', description: 'a' }],
    })
    mockClientFetch
      .mockResolvedValueOnce(okResponse(latest))
      .mockResolvedValueOnce(okResponse(latest))

    await saveAboutFields({ issues: [{ title: 'B', description: 'b' }] })

    expect(mockClientFetch).toHaveBeenNthCalledWith(
      2,
      apiRoutes.website.update,
      {
        about: {
          bio: 'first',
          issues: [{ title: 'B', description: 'b' }],
        },
      },
    )
  })

  describe('when no website exists yet', () => {
    it('creates the website then updates with the partial', async () => {
      const created = buildWebsite()
      mockClientFetch
        .mockResolvedValueOnce(okResponse(null))
        .mockResolvedValueOnce(okResponse(created))
        .mockResolvedValueOnce(okResponse(created))

      const result = await saveAboutFields({
        bio: 'fresh',
        issues: [{ title: 'Edu', description: 'K-12' }],
      })

      expect(result).toBe(true)
      expect(mockClientFetch).toHaveBeenCalledTimes(3)
      expect(mockClientFetch).toHaveBeenNthCalledWith(1, apiRoutes.website.get)
      expect(mockClientFetch).toHaveBeenNthCalledWith(
        2,
        apiRoutes.website.create,
        {},
      )
      expect(mockClientFetch).toHaveBeenNthCalledWith(
        3,
        apiRoutes.website.update,
        {
          about: {
            bio: 'fresh',
            issues: [{ title: 'Edu', description: 'K-12' }],
          },
        },
      )
    })

    it('returns false and does not call update when create fails', async () => {
      mockClientFetch
        .mockResolvedValueOnce(okResponse(null))
        .mockResolvedValueOnce(errorResponse())

      const result = await saveAboutFields({ bio: 'fresh' })

      expect(result).toBe(false)
      expect(mockClientFetch).toHaveBeenCalledTimes(2)
      expect(mockClientFetch).toHaveBeenNthCalledWith(
        2,
        apiRoutes.website.create,
        {},
      )
    })

    it('returns false when create rejects and does not call update', async () => {
      mockClientFetch
        .mockResolvedValueOnce(okResponse(null))
        .mockRejectedValueOnce(new Error('network down'))

      const result = await saveAboutFields({ bio: 'fresh' })

      expect(result).toBe(false)
      expect(mockClientFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('concurrency', () => {
    it("serializes overlapping calls so the second save merges with the first save's result", async () => {
      type Deferred<T> = {
        resolve: (v: T) => void
        promise: Promise<T>
      }
      const defer = <T>(): Deferred<T> => {
        let resolve!: (v: T) => void
        const promise = new Promise<T>((r) => (resolve = r))
        return { resolve, promise }
      }

      const get1 = defer<unknown>()
      const upd1 = defer<unknown>()
      const get2 = defer<unknown>()
      const upd2 = defer<unknown>()

      mockClientFetch
        .mockReturnValueOnce(get1.promise)
        .mockReturnValueOnce(upd1.promise)
        .mockReturnValueOnce(get2.promise)
        .mockReturnValueOnce(upd2.promise)

      const before = buildWebsite({
        bio: 'OLD',
        issues: [{ title: 'A', description: 'a' }],
      })
      const afterBio = buildWebsite({
        bio: 'NEW',
        issues: [{ title: 'A', description: 'a' }],
      })

      const p1 = saveAboutFields({ bio: 'NEW' })
      const p2 = saveAboutFields({
        issues: [{ title: 'B', description: 'b' }],
      })

      // Only the first call's GET is in flight; the second is queued.
      await flush()
      expect(mockClientFetch).toHaveBeenCalledTimes(1)
      expect(mockClientFetch).toHaveBeenNthCalledWith(1, apiRoutes.website.get)

      get1.resolve(okResponse(before))
      await flush()

      // First call has progressed to its update.
      expect(mockClientFetch).toHaveBeenCalledTimes(2)
      expect(mockClientFetch).toHaveBeenNthCalledWith(
        2,
        apiRoutes.website.update,
        { about: { bio: 'NEW', issues: [{ title: 'A', description: 'a' }] } },
      )

      // Second call must still be queued — its GET has not started.
      upd1.resolve(okResponse(afterBio))
      await p1
      await flush()

      expect(mockClientFetch).toHaveBeenCalledTimes(3)
      expect(mockClientFetch).toHaveBeenNthCalledWith(3, apiRoutes.website.get)

      // Now the second call's GET reflects the post-first-save state.
      get2.resolve(okResponse(afterBio))
      await flush()

      // The second update must merge with the fresh server state, NOT the
      // stale snapshot the caller may have closed over. Critically, bio must
      // remain 'NEW' — this is the regression we're guarding against.
      expect(mockClientFetch).toHaveBeenNthCalledWith(
        4,
        apiRoutes.website.update,
        {
          about: {
            bio: 'NEW',
            issues: [{ title: 'B', description: 'b' }],
          },
        },
      )

      upd2.resolve(okResponse(afterBio))
      await expect(p2).resolves.toBe(true)
    })
  })
})
