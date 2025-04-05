'use client'
import dynamic from 'next/dynamic'
import { userIsAdmin } from 'helpers/userHelper'
import { getUserCookie } from 'helpers/cookieHelper'
const AdminInvalidateCache = dynamic(() => import('./AdminInvalidateCache'))

export default function AdminClientLoad() {
  const user = getUserCookie(true)
  const isAdmin = userIsAdmin(user)

  if (!user || !isAdmin) {
    return null
  }

  return <>{user && isAdmin ? <AdminInvalidateCache /> : null}</>
}
