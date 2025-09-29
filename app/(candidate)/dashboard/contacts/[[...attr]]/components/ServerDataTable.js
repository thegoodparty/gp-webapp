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

export default function ServerDataTable({
  columns,
  data,
  pagination = {},
  className,
  onRowClick = () => {},
  onColumnVisibilityChange = () => {},
  initialColumnVisibility = {},
}) {
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

  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })
    router.push(`?${params.toString()}`)
  }

  const handlePageChange = (page) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages
    updateURL({ page })
  }

  const handlePageSizeChange = (pageSize) => {
    updateURL({ pageSize, page: 1 })
  }

  return (
    <div className={`w-full ${className || ''}`}>
      <DataTable
        columns={columns}
        data={data || []}
        pagination={false}
        onRowClick={onRowClick}
        onColumnVisibilityChange={onColumnVisibilityChange}
        initialColumnVisibility={initialColumnVisibility}
      />

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="hidden md:block flex-1 text-sm text-muted-foreground">
          Showing {data?.length || 0} of {totalResults} rows
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
              className="bg-white"
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZES.map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
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
              //   disabled={!hasPreviousPage}
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
      </div>
    </div>
  )
}
