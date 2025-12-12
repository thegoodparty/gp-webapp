'use client'
import { DataTableColumnHeader } from 'goodparty-styleguide'
import { useContacts } from '../hooks/ContactsProvider'
import ServerDataTable from './ServerDataTable'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useShowContactProModal } from '../hooks/ContactProModal'
import { type ColumnDef } from '@tanstack/react-table'
import { type VisibilityState } from '@tanstack/react-table'
import { type ReactNode } from 'react'

interface Contact {
  id: number
  firstName?: string
  lastName?: string
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
  return <MaybeBlurredContent>{value}</MaybeBlurredContent>
}

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: 'cellPhone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cell Phone" />
    ),
    cell: blurredCell,
  },
  {
    accessorKey: 'landline',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Landline" />
    ),
    cell: blurredCell,
  },
  {
    accessorKey: 'age',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: blurredCell,
  },
  {
    accessorKey: 'politicalParty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Political Party" />
    ),
  },
  {
    accessorKey: 'ethnicityGroup',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ethnicity" />
    ),
  },
  {
    accessorKey: 'language',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Language" />
    ),
  },
  {
    accessorKey: 'levelOfEducation',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Education Level" />
    ),
  },
  {
    accessorKey: 'maritalStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marital Status" />
    ),
  },
  {
    accessorKey: 'homeowner',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Homeowner" />
    ),
  },
  {
    accessorKey: 'businessOwner',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Owner" />
    ),
  },
  {
    accessorKey: 'hasChildrenUnder18',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Children Under 18" />
    ),
  },
  {
    accessorKey: 'veteranStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Veteran Status" />
    ),
  },
  {
    accessorKey: 'activeVoter',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active Voter" />
    ),
  },
  {
    accessorKey: 'voterStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Voter Status" />
    ),
  },
]

const initialColumnVisibility: VisibilityState = {
  ethnicityGroup: false,
  language: false,
  levelOfEducation: false,
  maritalStatus: false,
  estimatedIncomeRange: false,
  homeowner: false,
  businessOwner: false,
  hasChildrenUnder18: false,
  veteranStatus: false,
  activeVoter: false,
  voterStatus: false,
}

export default function ContactsTable() {
  const [contacts] = useContacts()
  const [campaign] = useCampaign()
  const showProUpgradeModal = useShowContactProModal()
  const { people, pagination } = contacts || {}
  const router = useRouter()
  const searchParams = useSearchParams()

  const onColumnVisibilityChange = (visibility: VisibilityState): void => {
    trackEvent(EVENTS.Contacts.ColumnEdited, {
      visibility: JSON.stringify(visibility),
    })
  }

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
    <div className="overflow-x-auto w-[calc(100vw-70px)] lg:w-[calc(100vw-346px)]">
      <ServerDataTable
        columns={columns}
        data={people as Contact[] | null | undefined}
        pagination={pagination}
        onColumnVisibilityChange={onColumnVisibilityChange}
        initialColumnVisibility={initialColumnVisibility}
        onRowClick={onRowClick}
      />
    </div>
  )
}
