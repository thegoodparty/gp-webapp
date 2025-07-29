'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import Tooltip from '@mui/material/Tooltip'
import Table from '@shared/utils/Table'
import { useMemo } from 'react'
import { formatPhoneNumber } from 'helpers/numberHelper'
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper'
import Actions from './Actions'
import { userIsAdmin } from 'helpers/userHelper'

const buildTableInputData = (users) => {
  if (!Array.isArray(users)) return []

  return users
    .map((user) => {
      if (!user) return null

      const metaData = user.metaData || {}
      const userType = userIsAdmin(user)
        ? 'admin'
        : user.roles?.join(', ') || ''

      return {
        ...user,
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
    .filter(Boolean) // Remove any null entries
}

export default function AdminUsersPage(props) {
  const users = props.users || []
  const { defaultFilters = [] } = props
  const inputData = buildTableInputData(users)

  const data = useMemo(() => inputData, [inputData])

  const columns = useMemo(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        collapse: true,
        cell: ({ row }) => {
          return <Actions user={row.original} />
        },
      },
      {
        id: 'name',
        header: 'Name',
        accessorFn: (row) =>
          `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'N/A',
        cell: ({ row }) => {
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
        cell: ({ row }) => {
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
        cell: ({ row }) => {
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
        cell: ({ row }) => {
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
        cell: ({ row }) => {
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
        cell: ({ row }) => row.original.zip || 'N/A',
      },
      {
        id: 'userType',
        header: 'User Type',
        accessorKey: 'userType',
        cell: ({ row }) => row.original.userType || 'N/A',
        collapse: true,
      },
      {
        id: 'id',
        accessorKey: 'id',
        hide: true,
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
          filterable
        />
      </PortalPanel>
    </AdminWrapper>
  )
}
