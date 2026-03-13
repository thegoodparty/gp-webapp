'use client'

import {
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from '@styleguide'
import { clsx } from 'clsx'
import { PAGE_SIZES } from './shared/constants'
import { type ColumnDef } from '@tanstack/react-table'
import { type VisibilityState } from '@tanstack/react-table'
import { useContactsTable } from '../hooks/ContactsTableProvider'

interface Pagination {
  totalPages?: number
  totalResults?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  currentPage?: number
  pageSize?: number
}

type PageElement = number | 'ellipsis'

function getPaginationRange(
  pageIndex: number,
  pageCount: number,
): PageElement[] {
  const totalPages = pageCount
  const currentPage = pageIndex

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_v, i) => i + 1)
  }

  const siblings = 1
  const pages: PageElement[] = []
  const left = Math.max(1, currentPage - siblings)
  const right = Math.min(totalPages, currentPage + siblings)

  if (left > 1) {
    pages.push(1)
    if (left > 2) {
      pages.push('ellipsis')
    }
  }

  for (let page = left; page <= right; page += 1) {
    pages.push(page)
  }

  if (right < totalPages) {
    if (right < totalPages - 1) {
      pages.push('ellipsis')
    }
    pages.push(totalPages)
  }

  return pages
}
interface ServerDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[] | null | undefined
  pagination?: Pagination
  className?: string
  onRowClick?: (row: TData) => void
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  initialColumnVisibility?: VisibilityState
}

export default function ServerDataTable<TData, TValue>({
  columns,
  data,
  pagination = {},
  className,
  onRowClick = () => {},
  onColumnVisibilityChange = () => {},
  initialColumnVisibility = {},
}: ServerDataTableProps<TData, TValue>) {
  const {
    pagination: tablePagination,
    goToPage,
    setPageSize,
  } = useContactsTable()

  const effectivePagination = tablePagination || pagination

  const {
    totalPages = 1,
    hasNextPage = false,
    hasPreviousPage = false,
    currentPage = 1,
    pageSize = 20,
  } = effectivePagination

  const handlePageChange = (page: number): void => {
    goToPage(page)
  }

  const handlePageSizeChange = (value: string): void => {
    const newPageSize = parseInt(value, 10)
    setPageSize(newPageSize)
  }

  return (
    <div className={`w-full ${className || ''}`}>
      <DataTable
        columns={columns}
        data={data || []}
        pagination={false}
        onRowClick={onRowClick}
        columnVisibilityControls={false}
        onColumnVisibilityChange={onColumnVisibilityChange}
        initialColumnVisibility={initialColumnVisibility}
      />
      <div className="flex flex-col md:flex-row items-center justify-between space-x-2 py-4">
        <div className="flex items-center w-full justify-between md:justify-start md:space-x-10 mb-4 md:mb-0">
          <div className="flex items-center justify-center space-x-2">
            <p className=" text-sm !font-normal !mb-0">Rows per page</p>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Pagination className="w-auto !mb-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (hasPreviousPage) {
                    handlePageChange(currentPage - 1)
                  }
                }}
                className={clsx(
                  'h-8 px-2',
                  !hasPreviousPage && 'pointer-events-none opacity-50',
                )}
              />
            </PaginationItem>

            {getPaginationRange(currentPage, totalPages).map((page, index) =>
              page === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(event) => {
                      event.preventDefault()
                      handlePageChange(page)
                    }}
                    size="small"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (hasNextPage) {
                    handlePageChange(currentPage + 1)
                  }
                }}
                className={clsx(
                  'h-8 px-2',
                  !hasNextPage && 'pointer-events-none opacity-50',
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
