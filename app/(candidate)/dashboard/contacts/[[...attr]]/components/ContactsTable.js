'use client'
import { DataTableColumnHeader } from 'goodparty-styleguide'
import { useContacts } from '../hooks/ContactsProvider'
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

export default function ContactsTable() {
  const [contacts] = useContacts()
  const { people, pagination } = contacts || {}
  const data = (people || []).map((contact) => {
    const addressParts = [
      contact.Residence_Addresses_AddressLine,
      contact.Residence_Addresses_City,
      contact.Residence_Addresses_State,
      contact.Residence_Addresses_Zip,
    ].filter(Boolean)

    return {
      ...contact,
      address: addressParts.join(', '),
      VoterTelephones_CellPhoneFormatted:
        contact.VoterTelephones_CellPhoneFormatted ||
        contact.VoterTelephones_LandlineFormatted,
    }
  })

  console.log('pagination', pagination)

  return (
    <div className="overflow-x-auto w-[calc(100vw-70px)] lg:w-[calc(100vw-346px)]">
      <ServerDataTable
        columns={columns}
        data={data}
        searchKey="Voters_FirstName"
        searchPlaceholder="Search contacts..."
        pagination={pagination}
      />
    </div>
  )
}
