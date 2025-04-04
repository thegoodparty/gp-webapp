'use client'
import React, { useMemo, useEffect } from 'react'
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table'
import styles from './Table.module.scss'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { matchSorter } from 'match-sorter'

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`${count} records...`}
        style={{ fontSize: '1.1rem', border: '0' }}
      />
    </span>
  )
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
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
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
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

  const initialFilters = useMemo(() => defaultFilters, [])

  const initialState = useMemo(
    () => ({
      pageIndex: 0,
      sortBy: initialSortById ? [{ id: initialSortById, desc: true }] : [],
      filters: initialFilters,
    }),
    [initialSortById],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState,
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  useEffect(() => {
    if (!pagination) {
      setPageSize(10000)
    }
  }, [pagination, setPageSize])

  return (
    <div className={styles.wrapper}>
      <table
        {...getTableProps()}
        className="font-sfpro text-lg text-indigo-800 font-normal shrink-0"
      >
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(
                (column, i) =>
                  Boolean(!column.hide) && (
                    <th
                      key={i}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      <div
                        className={`flex flex-row items-center ${
                          index === 0 && 'pl-2'
                        }`}
                      >
                        {column.render('Header')}
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaArrowDown className="text-xs font-normal ml-2 mb-[1px]" />
                          ) : (
                            <FaArrowUp className="text-xs font-normal ml-2 mb-[1px]" />
                          )
                        ) : null}
                      </div>
                      {column.canFilter && filterColumns
                        ? column.render('Filter')
                        : null}
                    </th>
                  ),
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map(
                  (cell, j) =>
                    Boolean(!cell.column.hide) && (
                      <td key={j} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    ),
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      {pagination && (
        <div className="flex items-center justify-center my-4">
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {'<<'}
          </button>
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {'<'}
          </button>
          <div className="px-3 flex items-center justify-center hidden md:block">
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <span>
              | Go to page:{' '}
              <input
                className="w-8 border p-1"
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
                }}
              />
            </span>
          </div>
          <select
            className="border px-2 py-1 mx-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {'>'}
          </button>
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>
        </div>
      )}
    </div>
  )
}
