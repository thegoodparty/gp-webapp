'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import Tooltip from '@mui/material/Tooltip'
import Table from '@shared/utils/Table'
import { useMemo } from 'react'
import { formatToPhone } from 'helpers/numberHelper'
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper'
import Actions from './Actions'
import { AddUserButton } from 'app/admin/users/components/AddUserButton'
import { userIsAdmin } from 'helpers/userHelper'

const buildTableInputData = (users) =>
  users.map((user) => {
    const metaData = user.metaData || {}
    const userType = userIsAdmin(user) ? 'admin' : user.roles?.join(', ')

    return {
      ...user,
      userType,
      lastVisited: metaData?.lastVisited && new Date(metaData?.lastVisited),
      createdAt: user.createdAt && new Date(user.createdAt),
      campaigns: user.campaigns || [],
    }
  })

export default function AdminUsersPage(props) {
  const users = props.users || []
  const { defaultFilters = [] } = props
  const inputData = buildTableInputData(users)

  const data = useMemo(() => inputData)

  let columns = useMemo(() => [
    {
      Header: 'Actions',
      collapse: true,
      accessor: 'actions',
      Cell: ({ row }) => {
        return <Actions user={row.original} />
      },
    },

    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ row }) => {
        return (
          <>
            {row.original.firstName} {row.original.lastName}
          </>
        )
      },
    },

    {
      Header: 'Email',
      accessor: 'email',

      Cell: ({ row }) => (
        <Tooltip title={row.original.email}>
          <a href={`mailto:${row.original.email}`}>{row.original.email}</a>
        </Tooltip>
      ),
    },
    {
      Header: 'Last Visit',
      accessor: 'lastVisited',
      sortType: 'datetime',
      Cell: ({ row }) => {
        return row.original.lastVisited &&
          row.original.lastVisited?.toString() !== 'Invalid Date'
          ? dateWithTime(row.original.lastVisited)
          : 'n/a'
      },
    },

    {
      Header: 'Date Created',
      accessor: 'createdAt',
      sortType: 'datetime',
      Cell: ({ row }) => {
        return row.original.createdAt?.toString() !== 'Invalid Date'
          ? dateUsHelper(row.original.createdAt)
          : 'n/a'
      },
    },

    {
      Header: 'Phone',
      accessor: 'phone',

      Cell: ({ row }) => (
        <Tooltip title={row.original.phone}>
          <a href={`tel:${row.original.phone}`}>
            {formatToPhone(row.original.phone)}
          </a>
        </Tooltip>
      ),
    },

    {
      Header: 'Zip',
      accessor: 'zip',
    },

    {
      Header: 'User Type',
      accessor: 'userType',

      collapse: true,
    },
    {
      accessor: 'id',
      hide: true,
    },
  ])

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="flex flex-col items-end">
          <AddUserButton />
        </div>
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
