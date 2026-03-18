import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { UserProvider } from './UserProvider'
import { useUser } from '@shared/hooks/useUser'
import { getUserCookie } from 'helpers/cookieHelper'
import { User } from 'helpers/types'

vi.mock('helpers/cookieHelper', () => ({
  getUserCookie: vi.fn(),
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
    vi.mocked(getUserCookie).mockReset()
  })

  it('provides user from cookie on first render without waiting for useEffect', () => {
    vi.mocked(getUserCookie).mockReturnValue(mockUser)

    const renders: (User | null)[] = []

    render(
      <UserProvider>
        <FirstRenderCapture onRender={(user) => renders.push(user)} />
      </UserProvider>,
    )

    expect(renders[0]).toEqual(mockUser)
  })

  it('returns null on first render when no cookie exists', () => {
    vi.mocked(getUserCookie).mockReturnValue(false)

    const renders: (User | null)[] = []

    render(
      <UserProvider>
        <FirstRenderCapture onRender={(user) => renders.push(user)} />
      </UserProvider>,
    )

    expect(renders[0]).toBeNull()
  })
})
