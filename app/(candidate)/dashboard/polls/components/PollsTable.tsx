'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'goodparty-styleguide'
import Link from 'next/link'
import { StatusBadge } from './StatusBadge'
import React from 'react'
import { Poll } from '../shared/serverApiCalls'

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
]

export const PollsTable: React.FC<{ polls: Poll[] }> = ({ polls }) => {
  if (polls.length === 0) {
    return (
      <div className="mt-4 text-center text-2xl font-medium">
        No polls found
      </div>
    )
  }
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
                <TableCell>{poll.responseCount || '-'}</TableCell>
                <TableCell>{poll.audienceSize || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
