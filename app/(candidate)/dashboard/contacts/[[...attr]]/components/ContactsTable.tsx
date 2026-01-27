'use client'
import { DataTableColumnHeader } from 'goodparty-styleguide'
import { useContactsTable } from '../hooks/ContactsTableProvider'
import ServerDataTable from './ServerDataTable'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useShowContactProModal } from '../hooks/ContactProModal'
import { type ColumnDef } from '@tanstack/react-table'
import { type ReactNode } from 'react'

interface Contact {
  id: number
  firstName?: string
  lastName?: string
  middleName?: string
  nameSuffix?: string
  cellPhone?: string
  landline?: string
  age?: number
  gender?: string
  address?: string
  politicalParty?: string
  ethnicityGroup?: string
  language?: string
  levelOfEducation?: string
  maritalStatus?: string
  estimatedIncomeRange?: string
  homeowner?: boolean
  businessOwner?: boolean
  hasChildrenUnder18?: boolean
  veteranStatus?: string
  activeVoter?: boolean
  voterStatus?: string
}

interface MaybeBlurredContentProps {
  children: ReactNode
}

const MaybeBlurredContent = ({ children }: MaybeBlurredContentProps) => {
  const [campaign] = useCampaign()
  if (campaign?.isPro) {
    return <>{children}</>
  }
  return <span className="blur-[6px]">{children}</span>
}

const blurredCell = ({
  row,
  column,
}: {
  row: { getValue: (key: string) => ReactNode }
  column: { id: string }
}) => {
  const value = row.getValue(column.id)
  return <MaybeBlurredContent>{valueFormatter(value)}</MaybeBlurredContent>
}

const valueFormatter = (value: any) => {
  if (
    value == null ||
    value == undefined ||
    value == 'Unknown' ||
    value == ''
  ) {
    return '--'
  }
  return value
}

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'firstName',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = [
        row.original.firstName,
        row.original.middleName,
        row.original.lastName,
        row.original.nameSuffix,
      ]
        .filter(Boolean)
        .join(' ')
      return (
        <p className="font-normal text-sm text-info-main">
          {valueFormatter(name)}
        </p>
      )
    },
  },
  {
    accessorKey: 'gender',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string
      if (gender != 'Male' && gender != 'Female') {
        return '--'
      }
      return gender.charAt(0).toUpperCase()
    },
  },
  {
    accessorKey: 'age',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => valueFormatter(row.getValue('age')),
  },
  {
    accessorKey: 'address',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      let value = valueFormatter(row.getValue('address'))
      // cut off address after the first comma
      value = value.split(',')[0]
      return <MaybeBlurredContent>{value}</MaybeBlurredContent>
    },
  },
  {
    accessorKey: 'cellPhone',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cell Phone" />
    ),
    cell: blurredCell,
  },
  {
    accessorKey: 'landline',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Landline" />
    ),
    cell: blurredCell,
  },
]

const SkeletonCell = () => {
  return <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
}

const skeletonColumns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'firstName',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: () => <SkeletonCell />,
  },
  {
    accessorKey: 'gender',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: () => <SkeletonCell />,
  },
  {
    accessorKey: 'age',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: () => <SkeletonCell />,
  },
  {
    accessorKey: 'address',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: () => <SkeletonCell />,
  },
  {
    accessorKey: 'cellPhone',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cell Phone" />
    ),
    cell: () => <SkeletonCell />,
  },
  {
    accessorKey: 'landline',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Landline" />
    ),
    cell: () => <SkeletonCell />,
  },
]

const createSkeletonData = (count: number): Contact[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
  }))
}

export default function ContactsTable() {
  const { filteredContacts, pagination, selectPerson, isLoading } =
    useContactsTable()
  const [campaign] = useCampaign()
  const showProUpgradeModal = useShowContactProModal()

  const onRowClick = (row: Contact): void => {
    if (!campaign?.isPro) {
      showProUpgradeModal(true)
      return
    }
    if (isLoading) {
      return
    }
    selectPerson(row.id)
  }

  const skeletonData = createSkeletonData(pagination?.pageSize || 20)
  const displayData = isLoading ? skeletonData : filteredContacts
  const displayColumns = isLoading ? skeletonColumns : columns

  return (
    <>
      <style>{`
        .contacts-table-wrapper table {
          table-layout: fixed;
          width: 100%;
        }
        .contacts-table-wrapper table th:nth-child(1),
        .contacts-table-wrapper table td:nth-child(1) {
          width: 200px;
          min-width: 150px;
        }
        .contacts-table-wrapper table th:nth-child(2),
        .contacts-table-wrapper table td:nth-child(2) {
          width: 80px;
          min-width: 60px;
        }
        .contacts-table-wrapper table th:nth-child(3),
        .contacts-table-wrapper table td:nth-child(3) {
          width: 80px;
          min-width: 60px;
        }
        .contacts-table-wrapper table th:nth-child(4),
        .contacts-table-wrapper table td:nth-child(4) {
          width: 250px;
          min-width: 200px;
        }
        .contacts-table-wrapper table th:nth-child(5),
        .contacts-table-wrapper table td:nth-child(5) {
          width: 150px;
          min-width: 120px;
        }
        .contacts-table-wrapper table th:nth-child(6),
        .contacts-table-wrapper table td:nth-child(6) {
          width: 150px;
          min-width: 120px;
        }
      `}</style>
      <div className="contacts-table-wrapper overflow-x-auto w-[calc(100vw-50px)] lg:w-[calc(100vw-336px)]">
        <ServerDataTable
          columns={displayColumns}
          data={displayData as Contact[] | null | undefined}
          pagination={isLoading ? undefined : pagination || undefined}
          onRowClick={onRowClick}
        />
      </div>
    </>
  )
}
