'use client'
import React, { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import styles from './Table.module.scss'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { matchSorter } from 'match-sorter'

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = (preFilteredRows || []).length
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function fuzzyTextFilterFn(row, columnId, filterValue) {
  return (
    matchSorter([row], filterValue, { keys: [(row) => row.getValue(columnId)] })
      .length > 0
  )
}

fuzzyTextFilterFn.autoRemove = (val) => !val

export default function Table({
  columns,
  data,
  filterColumns = true,
  pagination = true,
  initialSortById = '',
  defaultFilters = [],
}) {
  const filterTypes = useMemo(
    () => ({
      fuzzyText: filterColumns ? fuzzyTextFilterFn : undefined,
      text: (row, columnId, filterValue) => {
        const rowValue = row.getValue(columnId)
        return rowValue !== undefined
          ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
          : true
      },
    }),
    [filterColumns],
  )

  const defaultColumn = useMemo(
    () => ({
      Filter: filterColumns ? DefaultColumnFilter : undefined,
    }),
    [filterColumns],
  )

  const initialState = useMemo(
    () => ({
      pagination: {
        pageIndex: 0,
        pageSize: pagination ? 10 : 10000,
      },
      sorting: initialSortById ? [{ id: initialSortById, desc: true }] : [],
      filters: defaultFilters,
    }),
    [initialSortById, pagination],
  )

  const table = useReactTable({
    data,
    columns,
    state: initialState,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    defaultColumn,
    filterTypes,
  })

  return (
    <div className={styles.wrapper}>
      <table className="font-sfpro text-lg text-indigo-800 font-normal shrink-0">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(
                (header) =>
                  Boolean(!header.column.columnDef.hide) && (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div
                        className={`flex flex-row items-center ${
                          headerGroup.id === '0' && 'pl-2'
                        }`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <FaArrowUp className="text-xs font-normal ml-2 mb-[1px]" />
                          ),
                          desc: (
                            <FaArrowDown className="text-xs font-normal ml-2 mb-[1px]" />
                          ),
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                      {header.column.getCanFilter() && filterColumns
                        ? flexRender(
                            header.column.columnDef.Filter,
                            header.getContext(),
                          )
                        : null}
                    </th>
                  ),
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row
                .getVisibleCells()
                .map(
                  (cell) =>
                    Boolean(!cell.column.columnDef.hide) && (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ),
                )}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="flex items-center justify-center my-4">
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <div className="px-3 flex items-center justify-center hidden md:block">
            <span>
              Page{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </span>
            <span>
              | Go to page:{' '}
              <input
                className="w-8 border p-1"
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
              />
            </span>
          </div>
          <select
            className="border px-2 py-1 mx-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>
      )}
    </div>
  )
}
