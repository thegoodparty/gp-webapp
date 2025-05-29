import React from 'react'

export default function SimpleTable({ columns = [], data = [] }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={column.id || index}
              className="bg-primary text-white h-14 px-4 text-left text-base font-normal first:rounded-tl-lg last:rounded-tr-lg"
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
            className={`h-14 border-b border-gray-200 ${
              rowIndex % 2 === 0 ? 'bg-white' : 'bg-indigo-50'
            }`}
          >
            {columns.map((column, colIndex) => (
              <td key={colIndex} className="px-4 py-2">
                {column.cell ? column.cell({ row }) : row[column.accessorKey]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
