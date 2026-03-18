'use client'
import { createContext, useCallback, useMemo, useState } from 'react'
import { noop } from '@shared/utils/noop'
import { getUserCookie, setUserCookie } from 'helpers/cookieHelper'
import { queryClient } from '@shared/query-client'
import { User } from 'helpers/types'

export const UserContext = createContext<[User | null, (user: User) => void]>([
  null,
  noop,
])

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userState, setUserState] = useState<User | null>(() => {
    const cookieUser = getUserCookie(true)
    return cookieUser && cookieUser.id ? cookieUser : null
  })

  const setUser = useCallback((updated: User) => {
    queryClient.clear()
    setUserCookie(updated)
    setUserState(updated)
  }, [])

  const value = useMemo<[User | null, (user: User) => void]>(
    () => [userState, setUser],
    [userState, setUser],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
