'use client'
import { DataTableColumnHeader } from 'goodparty-styleguide'
import { useContacts } from '../hooks/ContactsProvider'
import ServerDataTable from './ServerDataTable'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

const columns = [
  {
    accessorKey: 'FirstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: 'MiddleName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Middle Name" />
    ),
  },
  {
    accessorKey: 'LastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },

  {
    accessorKey: 'Age',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: 'Gender',
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
    accessorKey: 'Precinct',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precinct" />
    ),
  },
  {
    accessorKey: 'VoterTelephones_CellPhoneFormatted',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cell Phone" />
    ),
  },

  {
    accessorKey: 'VoterTelephones_LandlineFormatted',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Landline" />
    ),
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: 'City',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
  },
  {
    accessorKey: 'County',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="County" />
    ),
  },
  {
    accessorKey: 'Residence_Addresses_ZipPlus4',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ZIP+4" />
    ),
  },
  {
    accessorKey: 'NameSuffix',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name Suffix" />
    ),
  },
  {
    accessorKey: 'State_House_District',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State House District" />
    ),
  },
  {
    accessorKey: 'State_Senate_District',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State Senate District" />
    ),
  },
  {
    accessorKey: 'US_Congressional_District',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="US Congressional District"
      />
    ),
  },
]

const initialColumnVisibility = {
  MiddleName: false,
  City: false,
  County: false,
  Residence_Addresses_ZipPlus4: false,
  NameSuffix: false,
  State_House_District: false,
  State_Senate_District: false,
  US_Congressional_District: false,
}

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
  const onColumnVisibilityChange = (visibility) => {
    console.log('visibility', visibility)
    trackEvent(EVENTS.Contacts.ColumnEdited, {
      visibility,
    })
  }

  return (
    <div className="overflow-x-auto w-[calc(100vw-70px)] lg:w-[calc(100vw-346px)]">
      <ServerDataTable
        columns={columns}
        data={data}
        searchKey="FirstName"
        searchPlaceholder="Search contacts..."
        pagination={pagination}
        onColumnVisibilityChange={onColumnVisibilityChange}
        initialColumnVisibility={initialColumnVisibility}
      />
    </div>
  )
}
