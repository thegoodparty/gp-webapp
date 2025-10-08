import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'goodparty-styleguide'
import Link from 'next/link'
import StatusBadge from './StatusBadge'

const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Status',
    accessorKey: 'status',
  },
  {
    header: 'Responses',
    accessorKey: 'responses',
  },
  {
    header: 'Sends',
    accessorKey: 'sends',
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
  },
]

const samplePolls = [
  {
    id: 1,
    name: 'Top community issues 1',
    status: 'In progress',
    sends: 1200,
  },
  {
    id: 2,
    name: 'Top community issues 2',
    status: 'Scheduled',
  },
  {
    id: 3,
    name: 'Top community issues 3',
    status: 'Done',
    responses: 100,
    sends: 100,
    actions: 'Gather more feedback',
  },
]

export default function PollsTable() {
  return (
    <div className="border border-gray-200 rounded-md w-[calc(100vw-48px)] md:w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <Table>
          <TableHeader>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {samplePolls.map((poll) => (
              <TableRow key={poll.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/polls/${poll.id}`}
                    className="block py-2 text-blue-500"
                  >
                    {poll.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={poll.status} />
                </TableCell>
                <TableCell>{poll.sends || '-'}</TableCell>
                <TableCell>{poll.responses || '-'}</TableCell>
                <TableCell>{poll.actions || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
