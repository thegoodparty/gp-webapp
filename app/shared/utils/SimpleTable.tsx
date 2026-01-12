import React from 'react'

interface Column<T> {
  id?: string
  header: string
  accessorKey?: keyof T
  cell?: (context: { row: T }) => React.ReactNode
}

interface SimpleTableProps<T> {
  columns?: Column<T>[]
  data?: T[]
  onRowClick?: ((row: T, e: React.MouseEvent<HTMLTableRowElement>) => void) | null
}

const SimpleTable = <T extends object>({
  columns = [],
  data = [],
  onRowClick = null,
}: SimpleTableProps<T>): React.JSX.Element => {
  const enableRowClick = typeof onRowClick === 'function'
  return (
    <table
      className="
        w-full
        border-separate
        border-spacing-0
        rounded-xl
        bg-white
        border
        border-gray-200
      "
    >
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={column.id || index}
              className="
                px-2.5
                pt-4
                pb-3
                text-left
                text-sm
                font-medium
                first:rounded-tl-xl
                last:rounded-tr-xl
                border-b
                border-gray-200
              "
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={`
              h-14
              ${
                rowIndex === data.length - 1
                  ? 'border-none'
                  : 'border-b border-gray-200'
              }
              
              ${enableRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            `}
            {...{
              ...(enableRowClick
                ? {
                    onClick: (e) => onRowClick(row, e),
                  }
                : {}),
            }}
          >
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className="
                  text-sm
                  font-normal
                  px-2.5
                  pt-4
                  pb-3
                  first:rounded-bl-xl
                  last:rounded-br-xl
                "
              >
                {column.cell ? column.cell({ row }) : (column.accessorKey ? String(row[column.accessorKey] ?? '') : null)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SimpleTable

