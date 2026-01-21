'use client'
import { createContext, useEffect, useState } from 'react'
import { getUserCookie, setUserCookie } from 'helpers/cookieHelper'
import { queryClient } from '@shared/query-client'
import { User } from 'helpers/types'

export const UserContext = createContext<[User | null, (user: User) => void]>([
  null,
  () => {},
])

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userState, setUserState] = useState<User | null>(null)

  useEffect(() => {
    const cookieUser = getUserCookie()
    if (cookieUser && cookieUser?.id) {
      setUserState(cookieUser)
    }
  }, [])

  const setUser = (updated: User) => {
    queryClient.clear()
    setUserCookie(updated)
    setUserState(updated)
  }

  return (
    <UserContext.Provider value={[userState, setUser]}>
      {children}
    </UserContext.Provider>
  )
}
