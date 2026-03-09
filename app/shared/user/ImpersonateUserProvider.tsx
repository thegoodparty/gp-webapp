'use client'

import { createContext, useState, useCallback, useEffect } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { getCookie, setCookie, deleteCookie } from 'helpers/cookieHelper'

interface ImpersonateUser {
  id: number
  email: string
}

interface ImpersonateUserContextValue {
  user: ImpersonateUser | null
  token: string | null
  impersonate: (email: string) => Promise<boolean>
  clear: () => void
}

export const ImpersonateUserContext =
  createContext<ImpersonateUserContextValue>({
    user: null,
    token: null,
    impersonate: () => Promise.resolve(false),
    clear: () => {},
  })

interface ImpersonateUserProviderProps {
  children: React.ReactNode
}

export const ImpersonateUserProvider = ({
  children,
}: ImpersonateUserProviderProps): React.JSX.Element => {
  const [user, setUser] = useState<ImpersonateUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = getCookie('impersonateToken')
    const savedUser = getCookie('impersonateUser')
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        deleteCookie('impersonateToken')
        deleteCookie('impersonateUser')
      }
    }
  }, [])

  const impersonate = useCallback(async (email: string): Promise<boolean> => {
    try {
      const resp = await clientFetch<{ user: ImpersonateUser; token: string }>(
        apiRoutes.admin.user.impersonate,
        { email },
      )
      if (resp.ok && resp.data?.token && resp.data?.user) {
        setToken(resp.data.token)
        setUser(resp.data.user)
        setCookie('impersonateToken', resp.data.token)
        setCookie('impersonateUser', JSON.stringify(resp.data.user))
        return true
      }
      return false
    } catch (err) {
      console.error('Impersonation failed:', err)
      return false
    }
  }, [])

  const clear = useCallback(() => {
    setToken(null)
    setUser(null)
    deleteCookie('impersonateToken')
    deleteCookie('impersonateUser')
  }, [])

  return (
    <ImpersonateUserContext.Provider
      value={{ user, token, impersonate, clear }}
    >
      {children}
    </ImpersonateUserContext.Provider>
  )
}
