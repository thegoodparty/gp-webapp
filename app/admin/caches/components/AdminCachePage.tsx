'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { useMemo } from 'react'
import BustCacheButton from './BustCacheButton'
import SimpleTable from '@shared/utils/SimpleTable'

interface CacheItem {
  name: string
  description: string
  paths: string[]
}

interface AdminCachePageProps {
  pathname: string
  title: string
}

export default function AdminUsersPage(
  props: AdminCachePageProps,
): React.JSX.Element {
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

  const data = useMemo(() => inputData, [])

  interface CacheColumn {
    id: string
    header: string
    accessorKey?: keyof CacheItem
    cell?: (context: { row: CacheItem }) => React.ReactNode
  }

  const nameColumn: CacheColumn = {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  }

  const descriptionColumn: CacheColumn = {
    id: 'description',
    header: 'Description',
    accessorKey: 'description',
  }

  const actionsColumn: CacheColumn = {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: { row: CacheItem }) => {
      return <BustCacheButton {...row} />
    },
  }

  const columns: CacheColumn[] = useMemo(
    () => [nameColumn, descriptionColumn, actionsColumn],
    [],
  )

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <SimpleTable data={data} columns={columns} />
      </PortalPanel>
    </AdminWrapper>
  )
}
