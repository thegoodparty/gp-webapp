'use client'
import Paper from '@shared/utils/Paper'
import SimpleDataTable from '@shared/utils/SimpleDataTable'
import { usePeople } from '../PeopleProvider'

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
]

const data = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    status: 'Inactive',
  },
]

export default function PeopleTable() {
  const [people] = usePeople()

  const data = people.map((person) => ({
    id: person.id,
    name: person.name,
    email: person.email,
    phone: person.phone,
  }))
  return (
    <Paper>
      <SimpleDataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search people..."
      />
    </Paper>
  )
}
