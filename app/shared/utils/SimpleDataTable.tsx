'use client'

import { useState, ReactNode } from 'react'

interface Column {
  accessorKey: string
  header: string | ReactNode
}

interface SimpleDataTableProps {
  columns: Column[]
  data: Array<Record<string, unknown>>
  searchKey?: string
  searchPlaceholder?: string
}

const SimpleDataTable = ({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
}: SimpleDataTableProps) => {
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredData = data.filter((row) => {
    if (!search || !searchKey) return true
    const searchValue = row[searchKey]?.toString().toLowerCase() || ''
    return searchValue.includes(search.toLowerCase())
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    const aVal = a[sortColumn] || ''
    const bVal = b[sortColumn] || ''
    const comparison = aVal.toString().localeCompare(bVal.toString())
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const handleSort = (columnKey: string): void => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  return (
    <div className="w-full">
      {searchKey && (
        <div className="flex items-center py-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full min-w-[800px] divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessorKey}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort(column.accessorKey)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortColumn === column.accessorKey && (
                      <span className="text-blue-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <tr
                  key={(row.id as string) || index}
                  className={`hover:bg-blue-100 cursor-pointer transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.accessorKey}
                      className="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate"
                    >
                      {row[column.accessorKey] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SimpleDataTable

