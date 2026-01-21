'use client'
import dynamic from 'next/dynamic'
import { userIsAdmin } from 'helpers/userHelper'
import { getUserCookie } from 'helpers/cookieHelper'
const AdminInvalidateCache = dynamic(() => import('./AdminInvalidateCache'))

export default function AdminClientLoad(): React.JSX.Element | null {
  const user = getUserCookie()
  const isAdmin = user && userIsAdmin(user)

  if (!user || !isAdmin) {
    return null
  }

  return <>{user && isAdmin ? <AdminInvalidateCache /> : null}</>
}
