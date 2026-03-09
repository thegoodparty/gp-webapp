'use client'

import { useClerk } from '@clerk/nextjs'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function LogoutPage() {
  const { signOut } = useClerk()
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.clear()
    signOut({ redirectUrl: '/' })
  }, [signOut, queryClient])

  return null
}
