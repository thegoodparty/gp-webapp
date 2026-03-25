import { describe, it, expect, beforeEach } from 'vitest'
import { api } from 'helpers/test-utils/api-mocking'
import { clientFetch } from './clientFetch'
import { ORG_SLUG_HEADER } from '@shared/organizations/constants'

const clearCookies = () => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/')
  })
}

describe('clientFetch org slug header', () => {
  beforeEach(() => {
    clearCookies()
  })

  it('sends the org slug header when the cookie is set', async () => {
    document.cookie = 'organization-slug=my-org'

    let capturedHeader: string | undefined
    api.mock('GET /v1/organizations', ({ headers }) => {
      capturedHeader = headers[ORG_SLUG_HEADER.toLowerCase()]
      return { status: 200, data: { organizations: [] } }
    })

    await clientFetch(
      { path: '/organizations', method: 'GET' },
      undefined,
    )

    expect(capturedHeader).toBe('my-org')
  })

  it('does not send the org slug header when no cookie is set', async () => {
    let capturedHeader: string | undefined
    api.mock('GET /v1/organizations', ({ headers }) => {
      capturedHeader = headers[ORG_SLUG_HEADER.toLowerCase()]
      return { status: 200, data: { organizations: [] } }
    })

    await clientFetch(
      { path: '/organizations', method: 'GET' },
      undefined,
    )

    expect(capturedHeader).toBeUndefined()
  })
})
