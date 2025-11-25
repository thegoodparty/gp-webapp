'use client'
import { deleteUserCookies } from 'helpers/cookieHelper'
import { useEffect } from 'react'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { queryClient } from '@shared/query-client'

async function fetchLogout() {
  // clear cookies set by server.
  try {
    return await clientFetch(apiRoutes.authentication.logout)
  } catch (e) {
    console.log('error at fetchLogout', e)
    return false
  }
}

export default function LogoutPage() {
  useEffect(() => {
    async function logout() {
      queryClient.clear()
      deleteUserCookies()
      await fetchLogout()
      window.location.replace('/')
    }
    logout()
  }, [])

  // TODO: we can show loading state here while logging out...
  return <></>
}
