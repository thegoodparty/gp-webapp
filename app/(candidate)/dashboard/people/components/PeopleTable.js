'use client'
import Paper from '@shared/utils/Paper'
import SimpleDataTable from '@shared/utils/SimpleDataTable'
import TEMP_SAMPLE_PEOPLE from '../temp-sample-people'

const columns = [
  {
    accessorKey: 'Voters_FirstName',
    header: 'First Name',
  },
  {
    accessorKey: 'Voters_LastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'Voters_Age',
    header: 'Age',
  },
  {
    accessorKey: 'Voters_Gender',
    header: 'Gender',
  },
  {
    accessorKey: 'Parties_Description',
    header: 'Party',
  },
  {
    accessorKey: 'Voters_VotingPerformanceEvenYearGeneral',
    header: 'Voter Status',
  },
  {
    accessorKey: 'VoterTelephones_CellPhoneFormatted',
    header: 'Phone',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
]

export default function PeopleTable() {
  const data = TEMP_SAMPLE_PEOPLE.map((person) => {
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

  return (
    <Paper>
      <div className="overflow-x-auto  w-[calc(100vw-70px)] lg:w-full">
        <SimpleDataTable
          columns={columns}
          data={data}
          searchKey="Voters_FirstName"
          searchPlaceholder="Search people..."
        />
      </div>
    </Paper>
  )
}
