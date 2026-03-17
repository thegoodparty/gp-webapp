import { render } from '@testing-library/react'
import { User, UserRole } from 'helpers/types'

let mockUser: User | null = null
const mockSetUser = vi.fn()

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => [mockUser, mockSetUser],
}))

const mockSearchParams = vi.hoisted(() => ({
  value: new URLSearchParams() as ReturnType<typeof import('next/navigation').useSearchParams>,
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({})),
  useSearchParams: () => mockSearchParams.value,
}))

const mockIdentifyUser = vi.fn().mockResolvedValue(true)
vi.mock('@shared/utils/analytics', () => ({
  identifyUser: (...args: unknown[]) => mockIdentifyUser(...args),
}))

const mockPersistUtmsOnce = vi.fn()
const mockGetPersistedUtms = vi.fn(() => ({}))
const mockExtractClids = vi.fn(() => ({}))

vi.mock('helpers/analyticsHelper', () => ({
  persistUtmsOnce: () => mockPersistUtmsOnce(),
  getPersistedUtms: () => mockGetPersistedUtms(),
  extractClids: (...args: unknown[]) => mockExtractClids(...args),
}))

const mockBuildUserTraits = vi.fn(() => ({}))
vi.mock('helpers/buildUserTraits', () => ({
  buildUserTraits: (...args: unknown[]) => mockBuildUserTraits(...args),
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
  mockSearchParams.value = new URLSearchParams()
  mockIdentifyUser.mockReset().mockResolvedValue(true)
  mockPersistUtmsOnce.mockReset()
  mockGetPersistedUtms.mockReset().mockReturnValue({})
  mockExtractClids.mockReset().mockReturnValue({})
  mockBuildUserTraits.mockReset().mockReturnValue(fullUserTraits)
})

describe('SegmentIdentify', () => {
  it('calls identifyUser with buildUserTraits output when user is logged in', async () => {
    mockUser = fullUser

    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(mockIdentifyUser).toHaveBeenCalledWith(42, fullUserTraits)
    })
    expect(mockBuildUserTraits).toHaveBeenCalledWith(fullUser)
  })

  it('calls identifyUser with null and UTM traits when no user', async () => {
    mockUser = null
    mockGetPersistedUtms.mockReturnValue({
      utm_source_first: 'google',
      utm_medium_last: 'cpc',
    })

    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(mockIdentifyUser).toHaveBeenCalledWith(null, {
        utm_source_first: 'google',
        utm_medium_last: 'cpc',
      })
    })
    expect(mockBuildUserTraits).not.toHaveBeenCalled()
  })

  it('merges UTM and CLID traits into user identification', async () => {
    mockUser = fullUser
    mockGetPersistedUtms.mockReturnValue({ utm_source_first: 'twitter' })
    mockExtractClids.mockReturnValue({ gclid: 'abc123' })

    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(mockIdentifyUser).toHaveBeenCalledWith(42, {
        ...fullUserTraits,
        utm_source_first: 'twitter',
        gclid: 'abc123',
      })
    })
  })

  it('calls persistUtmsOnce on render', async () => {
    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(mockPersistUtmsOnce).toHaveBeenCalled()
    })
  })

  it('skips extractClids when searchParams is null', async () => {
    mockUser = fullUser
    mockSearchParams.value = null

    render(<SegmentIdentify />)

    await vi.waitFor(() => {
      expect(mockIdentifyUser).toHaveBeenCalled()
    })
    expect(mockExtractClids).not.toHaveBeenCalled()
  })

  it('does not import or reference FeatureFlagsProvider', async () => {
    const source = await import('./SegmentIdentify')
    const sourceString = Object.keys(source).join(',')
    expect(sourceString).not.toContain('FeatureFlags')
    expect(sourceString).not.toContain('featureFlags')
  })
})
