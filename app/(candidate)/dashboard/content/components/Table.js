'use client';
import {
  useTable,
  useSortBy,
  usePagination,
} from 'react-table';
import styles from './Table.module.scss';
import { FaArrowUp } from 'react-icons/fa';
import { FaArrowDown } from 'react-icons/fa';

export default function Table({ columns, data }) {

  // Use the state and functions returned from useTable to build your UI
  const {
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
    },
    useSortBy,
    usePagination,
  );

  // Render the UI for your table
  return (
    <div className={styles.wrapper}>
      <table {...getTableProps() } className="font-sfpro text-lg text-indigo-800 font-normal">
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
                  <div className="flex flex-row items-center pl-10">
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <FaArrowDown className="text-xs font-normal ml-2 mb-[1px]"/>
                        : <FaArrowUp className="text-xs font-normal ml-2 mb-[1px]"/>
                      : ''}
                  </div>
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
        <div className="px-3 flex items-center justify-center">
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
    </div>
  );
}
