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

describe('saveAboutFields', () => {
  beforeEach(() => {
    mockClientFetch.mockReset()
  })

  describe('when an existing website is provided', () => {
    it('skips create and only calls update with the merged about payload', async () => {
      const existing = buildWebsite({
        bio: 'old bio',
        issues: [{ title: 'Healthcare', description: 'Universal' }],
        committee: 'Friends of Jane',
      })
      mockClientFetch.mockResolvedValueOnce(okResponse(existing))

      const result = await saveAboutFields({ bio: 'new bio' }, existing)

      expect(result).toBe(true)
      expect(mockClientFetch).toHaveBeenCalledTimes(1)
      expect(mockClientFetch).toHaveBeenCalledWith(apiRoutes.website.update, {
        about: {
          bio: 'new bio',
          issues: [{ title: 'Healthcare', description: 'Universal' }],
          committee: 'Friends of Jane',
        },
      })
    })

    it('returns false when update fails and does not throw', async () => {
      const existing = buildWebsite({ bio: 'old' })
      mockClientFetch.mockResolvedValueOnce(errorResponse())

      const result = await saveAboutFields({ bio: 'new' }, existing)

      expect(result).toBe(false)
      expect(mockClientFetch).toHaveBeenCalledTimes(1)
    })

    it('returns false when the update call rejects (resilient to thrown errors)', async () => {
      const existing = buildWebsite({ bio: 'old' })
      mockClientFetch.mockRejectedValueOnce(new Error('network down'))

      const result = await saveAboutFields({ bio: 'new' }, existing)

      expect(result).toBe(false)
    })

    it('treats null content the same as no about', async () => {
      const existing = {
        id: 1,
        vanityPath: 'jane-doe',
        status: 'unpublished',
        content: null,
        domain: null,
      } as Website
      mockClientFetch.mockResolvedValueOnce(okResponse(existing))

      const result = await saveAboutFields({ bio: 'new' }, existing)

      expect(result).toBe(true)
      expect(mockClientFetch).toHaveBeenCalledWith(apiRoutes.website.update, {
        about: { bio: 'new' },
      })
    })

    it('treats content with no about field as empty about', async () => {
      const existing = {
        id: 1,
        vanityPath: 'jane-doe',
        status: 'unpublished',
        content: {},
        domain: null,
      } as Website
      mockClientFetch.mockResolvedValueOnce(okResponse(existing))

      const result = await saveAboutFields({ bio: 'new' }, existing)

      expect(result).toBe(true)
      expect(mockClientFetch).toHaveBeenCalledWith(apiRoutes.website.update, {
        about: { bio: 'new' },
      })
    })
  })

  describe('when no existing website is provided', () => {
    it('calls create then update and returns true on success', async () => {
      mockClientFetch
        .mockResolvedValueOnce(okResponse(buildWebsite()))
        .mockResolvedValueOnce(okResponse(buildWebsite()))

      const result = await saveAboutFields(
        { bio: 'fresh', issues: [{ title: 'Edu', description: 'K-12' }] },
        null,
      )

      expect(result).toBe(true)
      expect(mockClientFetch).toHaveBeenCalledTimes(2)
      expect(mockClientFetch).toHaveBeenNthCalledWith(
        1,
        apiRoutes.website.create,
        {},
      )
      expect(mockClientFetch).toHaveBeenNthCalledWith(
        2,
        apiRoutes.website.update,
        {
          about: {
            bio: 'fresh',
            issues: [{ title: 'Edu', description: 'K-12' }],
          },
        },
      )
    })

    it('treats undefined existing the same as null', async () => {
      mockClientFetch
        .mockResolvedValueOnce(okResponse(buildWebsite()))
        .mockResolvedValueOnce(okResponse(buildWebsite()))

      const result = await saveAboutFields({ bio: 'x' }, undefined)

      expect(result).toBe(true)
      expect(mockClientFetch).toHaveBeenCalledTimes(2)
    })

    it('returns false and does not call update when create fails', async () => {
      mockClientFetch.mockResolvedValueOnce(errorResponse())

      const result = await saveAboutFields({ bio: 'fresh' }, null)

      expect(result).toBe(false)
      expect(mockClientFetch).toHaveBeenCalledTimes(1)
      expect(mockClientFetch).toHaveBeenCalledWith(apiRoutes.website.create, {})
    })

    it('returns false when create rejects and does not call update', async () => {
      mockClientFetch.mockRejectedValueOnce(new Error('network down'))

      const result = await saveAboutFields({ bio: 'fresh' }, null)

      expect(result).toBe(false)
      expect(mockClientFetch).toHaveBeenCalledTimes(1)
      expect(mockClientFetch).toHaveBeenCalledWith(apiRoutes.website.create, {})
    })

    it('returns false when create succeeds but update rejects', async () => {
      mockClientFetch
        .mockResolvedValueOnce(okResponse(buildWebsite()))
        .mockRejectedValueOnce(new Error('network down'))

      const result = await saveAboutFields({ bio: 'fresh' }, null)

      expect(result).toBe(false)
      expect(mockClientFetch).toHaveBeenCalledTimes(2)
    })
  })

  it('overwrites an existing field in about with the partial value', async () => {
    const existing = buildWebsite({
      bio: 'first',
      issues: [{ title: 'A', description: 'a' }],
    })
    mockClientFetch.mockResolvedValueOnce(okResponse(existing))

    await saveAboutFields(
      { issues: [{ title: 'B', description: 'b' }] },
      existing,
    )

    expect(mockClientFetch).toHaveBeenCalledWith(apiRoutes.website.update, {
      about: {
        bio: 'first',
        issues: [{ title: 'B', description: 'b' }],
      },
    })
  })
})
