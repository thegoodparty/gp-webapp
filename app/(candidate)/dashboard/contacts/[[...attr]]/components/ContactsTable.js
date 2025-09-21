'use client'
import { DataTableColumnHeader } from 'goodparty-styleguide'
import { useContacts } from '../hooks/ContactsProvider'
import ServerDataTable from './ServerDataTable'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

/*
example:

activeVoter
: 
"Unknown"
address
: 
"525 4th Ave W, Hendersonville, 28739-4223"
age
: 
40
businessOwner
: 
"Unknown"
cellPhone
: 
"(828) 338-9757"
estimatedIncomeRange
: 
"Unknown"
ethnicityGroup
: 
"European"
firstName
: 
"Kendall"
gender
: 
"Male"
hasChildrenUnder18
: 
"Unknown"
homeowner
: 
"Unknown"
landline
: 
"Unknown"
language
: 
"Unknown"
lastName
: 
"Weaver"
levelOfEducation
: 
"Unknown"
maritalStatus
: 
"Unknown"
politicalParty
: 
"Non-Partisan"
registeredVoter
: 
"Unknown"
veteranStatus
: 
"Unknown"
voterStatus
: 
"Unknown"
*/

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
  },
  {
    accessorKey: 'landline',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Landline" />
    ),
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
    accessorKey: 'estimatedIncomeRange',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Income Range" />
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
    accessorKey: 'registeredVoter',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registered Voter" />
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
  registeredVoter: false,
  voterStatus: false,
}

export default function ContactsTable() {
  const [contacts] = useContacts()
  const { people, pagination } = contacts || {}

  const onColumnVisibilityChange = (visibility) => {
    trackEvent(EVENTS.Contacts.ColumnEdited, {
      visibility,
    })
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
      />
    </div>
  )
}
