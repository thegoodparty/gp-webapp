'use client';
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import styles from './Table.module.scss';
import { FaArrowUp } from 'react-icons/fa';
import { FaArrowDown } from 'react-icons/fa';
import { matchSorter } from 'match-sorter';
import { useMemo, useEffect } from 'react';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);
  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  );
}
// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}
// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

export default function Table({
  columns,
  data,
  filterColumns = true,
  pagination = true,
}) {
  let filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: filterColumns ? fuzzyTextFilterFn : undefined,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    [],
  );
  let defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: filterColumns ? DefaultColumnFilter : undefined,
    }),
    [],
  );

  // Use the state and functions returned from useTable to build your UI
  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // for pagination below
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
      initialState: { pageIndex: 0 },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    if (pagination === false) {
      setPageSize(10000);
    }
  }, [setPageSize]);

  // Render the UI for your table
  return (
    <div className={styles.wrapper}>
      <table
        {...getTableProps()}
        className="font-sfpro text-lg text-indigo-800 font-normal shrink-0"
      >
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, i) => (
                <th
                  key={`${index}_${i}`}
                  // className="flex flex-row w-full"
                  {...column.getHeaderProps(
                    column.getSortByToggleProps({
                      className: column.collapse ? 'collapseCell' : '',
                    }),
                  )}
                >
                  <div
                    className={`flex flex-row items-center ${
                      index === 0 && 'pl-2'
                    }`}
                  >
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FaArrowDown className="text-xs font-normal ml-2 mb-[1px]" />
                      ) : (
                        <FaArrowUp className="text-xs font-normal ml-2 mb-[1px]" />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                  {column.canFilter && filterColumns
                    ? column.render('Filter')
                    : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                // className={i % 2 !== 0 && styles.odd}
                key={`tr_${i}`}
              >
                {row.cells.map((cell, j) => {
                  return (
                    <td
                      key={`td_${i}_${j}`}
                      {...cell.getCellProps({
                        className: cell.column.collapse ? 'collapseCell' : '',
                      })}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
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
          </button>{' '}
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
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <input
                className="w-8 border p-1"
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
              />
            </span>
          </div>
          <select
            className="border px-2 py-1 mx-1"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {'>'}
          </button>{' '}
          <button
            className="px-2 py-1 mx-1 bg-slate-600 text-white font-black rounded"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>{' '}
        </div>
      )}
    </div>
  );
}
