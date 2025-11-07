import { redirect } from 'next/navigation'
import { getServerUser } from './userServerHelper'

interface User {
  id: string
  email: string
  [key: string]: unknown
}

export const requireAuth = async (): Promise<User> => {
  const user = await getServerUser()
  if (!user) {
    redirect(`/login`)
  }
  return user
}

