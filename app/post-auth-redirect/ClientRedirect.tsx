'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ClientRedirect({ path }: { path: string }) {
  const router = useRouter()

  useEffect(() => {
    router.replace(path)
  }, [path, router])

  return null
}
