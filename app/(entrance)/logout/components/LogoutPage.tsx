'use client'

import { useClerk } from '@clerk/nextjs'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { deleteCookie } from 'helpers/cookieHelper'

export default function LogoutPage() {
  const { signOut } = useClerk()
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.clear()
    deleteCookie('impersonateToken')
    deleteCookie('impersonateUser')
    signOut({ redirectUrl: '/' }).catch(() => {
      window.location.href = '/'
    })
  }, [signOut, queryClient])

  return <p className="p-8 text-center">Signing out...</p>
}
