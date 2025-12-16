'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  ArrowLeftIcon,
  ArrowRightIcon,
} from 'goodparty-styleguide'
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from './shared/constants'
import { type ColumnDef } from '@tanstack/react-table'
import { type VisibilityState } from '@tanstack/react-table'

interface Pagination {
  totalPages?: number
  totalResults?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  currentPage?: number
  pageSize?: number
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
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    totalPages = 1,
    totalResults = 0,
    hasNextPage = false,
    hasPreviousPage = false,
    currentPage = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = pagination

  const updateURL = (
    newParams: Record<string, string | number | null | undefined>,
  ): void => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })
    router.push(`?${params.toString()}`)
  }

  const handlePageChange = (page: number): void => {
    let newPage = page
    if (newPage < 1) newPage = 1
    if (newPage > totalPages) newPage = totalPages
    updateURL({ page: newPage })
  }

  const handlePageSizeChange = (value: string): void => {
    const newPageSize = parseInt(value, 10)
    updateURL({ pageSize: newPageSize, page: 1 })
  }

  return (
    <div className={`w-full ${className || ''}`}>
      <DataTable
        columns={columns}
        data={data || []}
        pagination={true}
        onRowClick={onRowClick}
        columnVisibilityControls={false}
        onColumnVisibilityChange={onColumnVisibilityChange}
        initialColumnVisibility={initialColumnVisibility}
      />

      {/* <div className="flex items-center justify-between space-x-2 py-4">
        <div className="hidden md:block flex-1 text-sm text-muted-foreground">
          Showing {data?.length || 0} of {totalResults} rows
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
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
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePageChange(1)}
            >
              <span className="sr-only">Go to first page</span>
              <ArrowLeftIcon className="h-4 w-4" />
              <ArrowLeftIcon className="h-4 w-4 -ml-2" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePageChange(totalPages)}
              disabled={!hasNextPage}
            >
              <span className="sr-only">Go to last page</span>
              <ArrowRightIcon className="h-4 w-4" />
              <ArrowRightIcon className="h-4 w-4 -ml-2" />
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  )
}
