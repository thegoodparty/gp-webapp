import { describe, it, expect, beforeEach } from 'vitest'
import { api } from 'helpers/test-utils/api-mocking'
import { clientRequest } from './typed-request'
import { ORG_SLUG_HEADER } from '@shared/organizations/constants'

const clearCookies = () => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/')
  })
}

describe('clientRequest org slug header', () => {
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

    await clientRequest('GET /v1/organizations', {})

    expect(capturedHeader).toBe('my-org')
  })

  it('does not send the org slug header when no cookie is set', async () => {
    let capturedHeader: string | undefined
    api.mock('GET /v1/organizations', ({ headers }) => {
      capturedHeader = headers[ORG_SLUG_HEADER.toLowerCase()]
      return { status: 200, data: { organizations: [] } }
    })

    await clientRequest('GET /v1/organizations', {})

    expect(capturedHeader).toBeUndefined()
  })
})
