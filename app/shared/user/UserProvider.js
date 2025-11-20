'use client'
import { createContext, useEffect, useState } from 'react'
import { getUserCookie, setUserCookie } from 'helpers/cookieHelper'
import { queryClient } from '@shared/query-client'

export const UserContext = createContext([null, (updated) => {}])

export const UserProvider = ({ children }) => {
  const [userState, setUserState] = useState(null)

  useEffect(() => {
    const cookieUser = getUserCookie(true)
    if (cookieUser && cookieUser?.id) {
      setUserState(cookieUser)
    }
  }, [])

  const setUser = (updated) => {
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
