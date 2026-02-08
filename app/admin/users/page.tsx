import { adminAccessOnly } from 'helpers/permissionHelper'
import AdminUsersPage from './components/AdminUsersPage'
import pageMetaData from 'helpers/metadataHelper'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { SearchParams } from 'next/dist/server/request/search-params'

const meta = pageMetaData({
  title: 'Admin Users',
  description: 'Admin Users Dashboard.',
  slug: '/admin/users',
})
export const metadata = meta
export const maxDuration = 60

interface UserMetaData {
  lastVisited?: string
}

interface User {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  zip?: string
  createdAt?: string
  roles?: string[]
  metaData?: UserMetaData
  campaigns?: { id: number; slug: string }[]
}

const fetchUsers = async (): Promise<User[]> => {
  const resp = await serverFetch<User[]>(apiRoutes.admin.user.list)
  return resp.data
}

interface TableFilter {
  id: string
  value: string
}

const buildDefaultTableFilters = (searchParams: SearchParams): TableFilter[] =>
  Object.keys(searchParams).reduce<TableFilter[]>(
    (accumulator, key) => {
      const paramValue = searchParams[key]
      if (!paramValue) return accumulator
      
      const stringValue = Array.isArray(paramValue) ? paramValue[0] : paramValue
      if (!stringValue) return accumulator
      
      return [
        ...accumulator,
        {
          id: key,
          value: stringValue,
        },
      ]
    },
    [],
  )

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<React.JSX.Element> {
  await adminAccessOnly()
  const users = await fetchUsers()

  const childProps = {
    pathname: '/admin/users',
    title: 'Users',
    users,
    defaultFilters: buildDefaultTableFilters(searchParams),
  }

  return <AdminUsersPage {...childProps} />
}
