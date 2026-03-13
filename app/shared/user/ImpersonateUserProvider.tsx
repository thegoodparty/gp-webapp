'use client'
import { createContext, useEffect, useState } from 'react'
import * as z from 'zod'
import { getCookie, deleteCookie, setCookie } from 'helpers/cookieHelper'
import { noop } from '@shared/utils/noop'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

const impersonateUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
})

type ImpersonateUser = z.infer<typeof impersonateUserSchema>

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
    if (!token || !impersonateUserCookie) return
    const result = impersonateUserSchema.safeParse(
      JSON.parse(impersonateUserCookie),
    )
    if (result.success) {
      setToken(token)
      setUser(result.data)
    }
  }, [])

  const clear = () => {
    setToken(null)
    setUser(null)
    deleteCookie('impersonateToken')
    deleteCookie('impersonateUser')
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
