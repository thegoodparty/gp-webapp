'use client'
import { createContext, useEffect, useState } from 'react'
import { getCookie, deleteCookie, setCookie } from 'helpers/cookieHelper'
import { noop } from '@shared/utils/noop'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'
import { queryClient } from '@shared/query-client'

interface ImpersonateUser {
  id: string
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
    clear: noop,
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
    const token = getCookie('impersonateToken')
    const impersonateUserCookie = getCookie('impersonateUser')
    const user =
      impersonateUserCookie &&
      (JSON.parse(impersonateUserCookie) as ImpersonateUser)
    if (token && user) {
      setToken(token)
      setUser(user)
    }
  }, [])

  const clear = () => {
    setToken(null)
    setUser(null)
    deleteCookie('impersonateToken')
    deleteCookie('impersonateUser')
    deleteCookie(ORG_SLUG_COOKIE)
    queryClient.clear()
  }

  const set = (token: string, user: ImpersonateUser) => {
    if (!token || !user) {
      console.error('Invalid token or user')
      return
    }
    setToken(token)
    setUser(user)
    setCookie('impersonateToken', token)
    setCookie('impersonateUser', JSON.stringify(user))
  }

  const impersonate = async (email: string) => {
    try {
      const resp = await clientFetch(apiRoutes.admin.user.impersonate, {
        email,
      })
      const data = resp.data as
        | { token?: string; user?: ImpersonateUser }
        | undefined
      const { token, user } = data || {}
      if (token && user) {
        set(token, user)
        deleteCookie(ORG_SLUG_COOKIE)
        queryClient.clear()
        return true
      }
    } catch (e) {
      console.error('error', e)
    }
    return false
  }

  return (
    <ImpersonateUserContext.Provider
      value={{ user, token, impersonate, clear }}
    >
      {children}
    </ImpersonateUserContext.Provider>
  )
}
