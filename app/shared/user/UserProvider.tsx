'use client'

import { useUser as useClerkUser } from '@clerk/nextjs'
import { createContext, useCallback, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { User } from 'helpers/types'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { API_VERSION_PREFIX } from 'appEnv'
import { noop } from '@shared/utils/noop'

export type UserContextValue = [User | null, (user?: User) => void, boolean]

const CURRENT_USER_QUERY_KEY = 'currentUser'

export const UserContext = createContext<UserContextValue>([null, noop, true])

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const resp = await clientFetch<User>(apiRoutes.user.getUser)
    if (!resp.ok) return null
    return resp.data
  } catch {
    return null
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isSignedIn, isLoaded } = useClerkUser()
  const queryClient = useQueryClient()

  const { data: appUser, isLoading: isQueryLoading } = useQuery({
    queryKey: [CURRENT_USER_QUERY_KEY],
    queryFn: fetchCurrentUser,
    enabled: isLoaded && !!isSignedIn,
  })

  const updateUser = useCallback(
    (_user?: User) => {
      queryClient.invalidateQueries({
        queryKey: [CURRENT_USER_QUERY_KEY],
      })
    },
    [queryClient],
  )

  const reconnectTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let disposed = false
    let es: EventSource | null = null

    const connect = () => {
      es = new EventSource(
        `/api${API_VERSION_PREFIX}/users/me/events`,
      )

      es.addEventListener('user.updated', () => {
        queryClient.invalidateQueries({
          queryKey: [CURRENT_USER_QUERY_KEY],
        })
      })

      es.onerror = () => {
        es?.close()
        if (!disposed) {
          reconnectTimeoutRef.current = setTimeout(connect, 5000)
        }
      }
    }

    connect()

    return () => {
      disposed = true
      es?.close()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [isLoaded, isSignedIn, queryClient])

  const isUserLoading =
    !isLoaded || (!!isSignedIn && isQueryLoading)

  const value: User | null =
    isLoaded && !isSignedIn ? null : appUser ?? null

  return (
    <UserContext.Provider value={[value, updateUser, isUserLoading]}>
      {children}
    </UserContext.Provider>
  )
}
