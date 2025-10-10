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
import { polls } from '../tempData'

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

export default function PollsTable() {
  return (
    <div className="border border-gray-200 rounded-md w-[calc(100vw-48px)] md:w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {polls.map((poll) => (
              <TableRow key={poll.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/polls/${poll.id}`}
                    className="block py-2 text-blue-500"
                    aria-label={`View poll: ${poll.name}`}
                  >
                    {poll.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={poll.status} />
                </TableCell>
                <TableCell>{poll.responses || '-'}</TableCell>
                <TableCell>{poll.sends || '-'}</TableCell>
                <TableCell>{poll.actions || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
