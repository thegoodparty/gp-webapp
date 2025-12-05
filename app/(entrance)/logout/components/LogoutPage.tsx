'use client'
import { deleteUserCookies } from 'helpers/cookieHelper'
import { useEffect } from 'react'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { queryClient } from '@shared/query-client'

const fetchLogout = async () => {
  try {
    return await clientFetch(apiRoutes.authentication.logout)
  } catch (e) {
    console.log('error at fetchLogout', e)
    return false
  }
}

export default function LogoutPage(): React.JSX.Element {
  useEffect(() => {
    const logout = async () => {
      queryClient.clear()
      deleteUserCookies()
      await fetchLogout()
      window.location.replace('/')
    }
    logout()
  }, [])

  return <></>
}


