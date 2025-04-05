'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import Table from '@shared/utils/Table'
import { useMemo } from 'react'
import BustCacheButton from './BustCacheButton'

export default function AdminUsersPage(props) {
  const inputData = [
    {
      name: 'candidates',
      description: 'Invalidate all candidates',
      paths: ['/candidate/[slug]'],
    },
    {
      name: 'blog articles',
      description: 'Invalidate all blog articles',
      paths: ['/blog/article/[slug]'],
    },
    {
      name: 'blog sections',
      description: 'Invalidate all blog sections',
      paths: ['/blog/section/[slug]'],
    },
    {
      name: 'blog homepage',
      description: 'Invalidate blog homepage',
      paths: ['/blog'],
    },
    {
      name: 'election pages',
      description: 'Invalidate election pages',
      paths: ['/(company)/elections/[...params]'],
    },
    {
      name: 'political terms',
      description: 'Invalidate political terms',
      paths: ['/political-terms/', '/political-terms/[slug]'],
    },
    {
      name: 'Dashboard > my content',
      description: 'Invalidate my content section of the dashboard',
      paths: ['/dashboard/content'],
    },
    {
      name: 'custom path',
      description: 'Invalidate custom path',
      paths: [],
    },
  ]

  const data = useMemo(() => inputData)

  let columns = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Actions',
      collapse: true,
      accessor: 'actions',
      Cell: ({ row }) => {
        return <BustCacheButton {...row.original} />
      },
    },
  ])

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <Table
          data={data}
          columns={columns}
          defaultPageSize={25}
          showPagination
          filterable
        />
      </PortalPanel>
    </AdminWrapper>
  )
}
