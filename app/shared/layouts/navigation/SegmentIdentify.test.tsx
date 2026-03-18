import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { User, UserRole } from 'helpers/types'
import { identifyUser } from '@shared/utils/analytics'
import { persistUtmsOnce, getPersistedUtms, extractClids } from 'helpers/analyticsHelper'
import { buildUserTraits } from 'helpers/buildUserTraits'

let mockUser: User | null = null
let mockSearchParamsValue: URLSearchParams | null = new URLSearchParams()

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => [mockUser, vi.fn()],
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({})),
  useSearchParams: () => mockSearchParamsValue,
}))

vi.mock('@shared/utils/analytics', () => ({
  identifyUser: vi.fn().mockResolvedValue(true),
}))

vi.mock('helpers/analyticsHelper', () => ({
  persistUtmsOnce: vi.fn(),
  getPersistedUtms: vi.fn(() => ({})),
  extractClids: vi.fn(() => ({})),
}))

vi.mock('helpers/buildUserTraits', () => ({
  buildUserTraits: vi.fn(() => ({})),
}))

import SegmentIdentify from './SegmentIdentify'

const fullUser: User = {
  id: 42,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '555-1234',
  zip: '90210',
  roles: [UserRole.candidate],
  hasPassword: true,
}

const fullUserTraits = {
  email: 'jane@example.com',
  name: 'Jane Doe',
  phone: '555-1234',
  zip: '90210',
}

beforeEach(() => {
  mockUser = null
  mockSearchParamsValue = new URLSearchParams()
  vi.mocked(identifyUser).mockReset().mockResolvedValue(true)
  vi.mocked(persistUtmsOnce).mockReset()
  vi.mocked(getPersistedUtms).mockReset().mockReturnValue({})
  vi.mocked(extractClids).mockReset().mockReturnValue({})
  vi.mocked(buildUserTraits).mockReset().mockReturnValue(fullUserTraits)
})

describe('SegmentIdentify', () => {
  it('calls identifyUser with buildUserTraits output when user is logged in', async () => {
    mockUser = fullUser

    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(identifyUser).toHaveBeenCalledWith(42, fullUserTraits)
    })
    expect(buildUserTraits).toHaveBeenCalledWith(fullUser)
  })

  it('calls identifyUser with null and UTM traits when no user', async () => {
    mockUser = null
    vi.mocked(getPersistedUtms).mockReturnValue({
      utm_source_first: 'google',
      utm_medium_last: 'cpc',
    })

    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(identifyUser).toHaveBeenCalledWith(null, {
        utm_source_first: 'google',
        utm_medium_last: 'cpc',
      })
    })
    expect(buildUserTraits).not.toHaveBeenCalled()
  })

  it('merges UTM and CLID traits into user identification', async () => {
    mockUser = fullUser
    vi.mocked(getPersistedUtms).mockReturnValue({ utm_source_first: 'twitter' })
    vi.mocked(extractClids).mockReturnValue({ gclid: 'abc123' })

    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(identifyUser).toHaveBeenCalledWith(42, {
        ...fullUserTraits,
        utm_source_first: 'twitter',
        gclid: 'abc123',
      })
    })
  })

  it('calls persistUtmsOnce on render', async () => {
    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(persistUtmsOnce).toHaveBeenCalled()
    })
  })

  it('skips extractClids when searchParams is null', async () => {
    mockUser = fullUser
    mockSearchParamsValue = null

    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(identifyUser).toHaveBeenCalled()
    })
    expect(extractClids).not.toHaveBeenCalled()
  })
})
