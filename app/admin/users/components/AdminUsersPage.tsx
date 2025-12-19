'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import Tooltip from '@mui/material/Tooltip'
import Table from '@shared/utils/Table'
import { useMemo } from 'react'
import { formatPhoneNumber } from 'helpers/numberHelper'
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper'
import Actions from './Actions'
import { USER_ROLES } from 'helpers/userHelper'
import { ColumnDef, CellContext, ColumnFiltersState } from '@tanstack/react-table'

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
  campaigns?: Campaign[]
}

interface Campaign {
  id: number
  slug: string
}

interface TableUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  zip: string
  createdAt: Date | null
  lastVisited: Date | null
  userType: string
  campaigns: Campaign[]
}

interface AdminUsersPageProps {
  users?: User[]
  defaultFilters?: ColumnFiltersState
  pathname: string
  title: string
}

const buildTableInputData = (users: User[]): TableUser[] => {
  if (!Array.isArray(users)) return []

  return users
    .map((user) => {
      if (!user) return null

      const metaData = user.metaData || {}
      const userType = user.roles?.includes(USER_ROLES.ADMIN)
        ? 'admin'
        : user.roles?.join(', ') || ''

      return {
        id: user.id,
        userType,
        lastVisited: metaData?.lastVisited
          ? new Date(metaData.lastVisited)
          : null,
        createdAt: user.createdAt ? new Date(user.createdAt) : null,
        campaigns: user.campaigns || [],
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        zip: user.zip || '',
      }
    })
    .filter((user): user is TableUser => user !== null)
}

export default function AdminUsersPage(
  props: AdminUsersPageProps,
): React.JSX.Element {
  const users = props.users || []
  const { defaultFilters = [] } = props
  const inputData = buildTableInputData(users)

  const data = useMemo(() => inputData, [inputData])

  const columns: ColumnDef<TableUser>[] = useMemo(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: CellContext<TableUser, unknown>) => {
          return <Actions user={row.original} />
        },
      },
      {
        id: 'name',
        header: 'Name',
        accessorFn: (row: TableUser) =>
          `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'N/A',
        cell: ({ row }: CellContext<TableUser, unknown>) => {
          const name = `${row.original.firstName || ''} ${
            row.original.lastName || ''
          }`.trim()
          return name || 'N/A'
        },
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        cell: ({ row }: CellContext<TableUser, unknown>) => {
          const email = row.original.email
          if (!email) return 'N/A'
          return (
            <Tooltip title={email}>
              <a href={`mailto:${email}`}>{email}</a>
            </Tooltip>
          )
        },
      },
      {
        id: 'lastVisited',
        header: 'Last Visit',
        accessorKey: 'lastVisited',
        sortingFn: 'datetime',
        cell: ({ row }: CellContext<TableUser, unknown>) => {
          const date = row.original.lastVisited
          return date && date.toString() !== 'Invalid Date'
            ? dateWithTime(date)
            : 'N/A'
        },
      },
      {
        id: 'createdAt',
        header: 'Date Created',
        accessorKey: 'createdAt',
        sortingFn: 'datetime',
        cell: ({ row }: CellContext<TableUser, unknown>) => {
          const date = row.original.createdAt
          return date && date.toString() !== 'Invalid Date'
            ? dateUsHelper(date)
            : 'N/A'
        },
      },
      {
        id: 'phone',
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ row }: CellContext<TableUser, unknown>) => {
          const phone = row.original.phone
          if (!phone) return 'N/A'
          return (
            <Tooltip title={phone}>
              <a href={`tel:${phone}`}>{formatPhoneNumber(phone)}</a>
            </Tooltip>
          )
        },
      },
      {
        id: 'zip',
        header: 'Zip',
        accessorKey: 'zip',
        cell: ({ row }: CellContext<TableUser, unknown>) =>
          row.original.zip || 'N/A',
      },
      {
        id: 'userType',
        header: 'User Type',
        accessorKey: 'userType',
        cell: ({ row }: CellContext<TableUser, unknown>) =>
          row.original.userType || 'N/A',
      },
      {
        id: 'id',
        accessorKey: 'id',
      },
    ],
    [],
  )

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <Table
          data={data}
          columns={columns}
          defaultPageSize={25}
          defaultFilters={defaultFilters}
          showPagination
        />
      </PortalPanel>
    </AdminWrapper>
  )
}
