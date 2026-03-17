import { render } from '@testing-library/react'
import { UserProvider } from './UserProvider'
import { useUser } from '@shared/hooks/useUser'
import { User } from 'helpers/types'

const { mockGetUserCookie } = vi.hoisted(() => ({
  mockGetUserCookie: vi.fn(),
}))

vi.mock('helpers/cookieHelper', () => ({
  getUserCookie: mockGetUserCookie,
  setUserCookie: vi.fn(),
}))

vi.mock('@shared/query-client', () => ({
  queryClient: { clear: vi.fn() },
}))

const mockUser: User = {
  id: 123,
  email: 'tyler@fightclub.org',
  firstName: 'Tyler',
  lastName: 'Durden',
  hasPassword: false,
  roles: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const FirstRenderCapture = ({
  onRender,
}: {
  onRender: (user: User | null) => void
}) => {
  const [user] = useUser()
  onRender(user)
  return null
}

describe('UserProvider', () => {
  beforeEach(() => {
    mockGetUserCookie.mockReset()
  })

  it('provides user from cookie on first render without waiting for useEffect', () => {
    mockGetUserCookie.mockReturnValue(mockUser)

    const renders: (User | null)[] = []

    render(
      <UserProvider>
        <FirstRenderCapture onRender={(user) => renders.push(user)} />
      </UserProvider>,
    )

    expect(renders[0]).toEqual(mockUser)
  })

  it('returns null on first render when no cookie exists', () => {
    mockGetUserCookie.mockReturnValue(false)

    const renders: (User | null)[] = []

    render(
      <UserProvider>
        <FirstRenderCapture onRender={(user) => renders.push(user)} />
      </UserProvider>,
    )

    expect(renders[0]).toBeNull()
  })
})
