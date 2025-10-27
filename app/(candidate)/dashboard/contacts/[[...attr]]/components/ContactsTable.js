'use client'
import { DataTableColumnHeader } from 'goodparty-styleguide'
import { useContacts } from '../hooks/ContactsProvider'
import ServerDataTable from './ServerDataTable'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useShowContactProModal } from '../hooks/ContactProModal'

const MaybeBlurredContent = ({ children }) => {
  const [campaign] = useCampaign()
  if (campaign?.isPro) {
    return children
  }
  return <span className="blur-[6px]">{children}</span>
}

const blurredCell = ({ row, column }) => {
  const value = row.getValue(column.id)
  return <MaybeBlurredContent>{value}</MaybeBlurredContent>
}

const columns = [
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
  // uncomment when the data is done loading
  // {
  //   accessorKey: 'estimatedIncomeRange',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Income Range" />
  //   ),
  // },
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

const initialColumnVisibility = {
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

  const onColumnVisibilityChange = (visibility) => {
    trackEvent(EVENTS.Contacts.ColumnEdited, {
      visibility,
    })
  }

  const onRowClick = (row) => {
    if (!campaign?.isPro) {
      showProUpgradeModal(true)
      return
    }
    router.push(`/dashboard/contacts/${row.id}?${searchParams.toString()}`)
  }

  return (
    <div className="overflow-x-auto w-[calc(100vw-70px)] lg:w-[calc(100vw-346px)]">
      <ServerDataTable
        columns={columns}
        data={people}
        searchKey="FirstName"
        searchPlaceholder="Search contacts..."
        pagination={pagination}
        onColumnVisibilityChange={onColumnVisibilityChange}
        initialColumnVisibility={initialColumnVisibility}
        onRowClick={onRowClick}
      />
    </div>
  )
}
