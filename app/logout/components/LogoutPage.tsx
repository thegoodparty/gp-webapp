'use client'

import { useClerk } from '@clerk/nextjs'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function LogoutPage() {
  const { signOut } = useClerk()
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      queryClient.clear()
      try {
        await signOut({ redirectUrl: '/login' })
      } catch {
        router.push('/login')
      }
    }
    logout()
  }, [signOut, queryClient, router])

  return <p className="p-8 text-center">Signing out...</p>
}
