'use client'
import { DataTableColumnHeader } from 'goodparty-styleguide'
import { usePeople } from './PeopleProvider'
import ServerDataTable from './ServerDataTable'

const columns = [
  {
    accessorKey: 'Voters_FirstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: 'Voters_LastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: 'Voters_Age',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: 'Voters_Gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
  },
  {
    accessorKey: 'Parties_Description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Party" />
    ),
  },
  {
    accessorKey: 'Voters_VotingPerformanceEvenYearGeneral',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Voter Status" />
    ),
  },
  {
    accessorKey: 'VoterTelephones_CellPhoneFormatted',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
]

export default function PeopleTable() {
  const [people] = usePeople()
  const data = (people?.data || []).map((person) => {
    const addressParts = [
      person.Residence_Addresses_AddressLine,
      person.Residence_Addresses_City,
      person.Residence_Addresses_State,
      person.Residence_Addresses_Zip,
    ].filter(Boolean)

    return {
      ...person,
      address: addressParts.join(', '),
      VoterTelephones_CellPhoneFormatted:
        person.VoterTelephones_CellPhoneFormatted ||
        person.VoterTelephones_LandlineFormatted,
    }
  })

  // Extract pagination info from people data
  const pagination = {
    totalPages: people?.pagination?.totalPages || 1,
    totalItems: people?.pagination?.totalItems || 0,
    hasNextPage: people?.pagination?.hasNextPage || false,
    hasPreviousPage: people?.pagination?.hasPreviousPage || false,
  }

  return (
    <div className="overflow-x-auto w-[calc(100vw-70px)] lg:w-[calc(100vw-346px)]">
      <ServerDataTable
        columns={columns}
        data={data}
        searchKey="Voters_FirstName"
        searchPlaceholder="Search people..."
        pagination={pagination}
      />
    </div>
  )
}
