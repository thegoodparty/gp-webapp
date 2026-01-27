'use client'
import { DataTableColumnHeader } from 'goodparty-styleguide'
import { useContacts } from '../hooks/ContactsProvider'
import ServerDataTable from './ServerDataTable'
import { useRouter, useSearchParams } from 'next/navigation'
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

export default function ContactsTable() {
  const [contacts] = useContacts()
  const [campaign] = useCampaign()
  const showProUpgradeModal = useShowContactProModal()
  const { people, pagination } = contacts || {}
  const router = useRouter()
  const searchParams = useSearchParams()

  const onRowClick = (row: Contact): void => {
    if (!campaign?.isPro) {
      showProUpgradeModal(true)
      return
    }
    router.push(
      `/dashboard/contacts/${row.id}?${searchParams?.toString() ?? ''}`,
    )
  }

  return (
    <div className="overflow-x-auto w-[calc(100vw-50px)] lg:w-[calc(100vw-336px)]">
      <ServerDataTable
        columns={columns}
        data={people as Contact[] | null | undefined}
        pagination={pagination}
        onRowClick={onRowClick}
      />
    </div>
  )
}
