'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  MoreHorizontalIcon,
} from './icons'

import { cn } from '@styleguide/lib/utils'
import { Button } from '@styleguide/components/ui/button'
import { Checkbox } from '@styleguide/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@styleguide/components/ui/dropdown-menu'
import { Input } from '@styleguide/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@styleguide/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@styleguide/components/ui/table'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@styleguide/components/ui/pagination'
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  pagination?: boolean
  columnVisibilityControls?: boolean
  onRowClick?: (row: TData) => void
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  initialColumnVisibility?: VisibilityState
  className?: string
}

type PageElement = number | 'ellipsis'

function getPaginationRange(
  pageIndex: number,
  pageCount: number,
): PageElement[] {
  const totalPages = pageCount
  const currentPage = pageIndex + 1

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

function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Filter...',
  pagination = true,
  columnVisibilityControls = true,
  onRowClick,
  onColumnVisibilityChange,
  initialColumnVisibility = {},
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility)
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        setColumnVisibility((prev) => {
          const newVisibility = updaterOrValue(prev)
          onColumnVisibilityChange?.(newVisibility)
          return newVisibility
        })
      } else {
        setColumnVisibility(updaterOrValue)
        onColumnVisibilityChange?.(updaterOrValue)
      }
    },
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className={cn('w-full', className)}>
      {(columnVisibilityControls || searchKey) && (
        <div className="flex items-center py-4">
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
          {columnVisibilityControls && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDownIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-[60vh] overflow-y-auto"
              >
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        <span className="block px-2">
                          {(() => {
                            const header = column.columnDef.header
                            if (typeof header === 'string') {
                              return header
                            }
                            if (typeof header === 'function') {
                              try {
                                const headerElement = header({
                                  column,
                                  header: column.columnDef as any,
                                  table,
                                })
                                if (headerElement?.props?.title) {
                                  return headerElement.props.title
                                }
                              } catch (_e) {
                                // If header function fails, fall back to column.id
                              }
                            }
                            return column.id
                          })()}
                        </span>
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table className="!m-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                  className={cn(
                    'h-12',
                    onRowClick ? 'cursor-pointer hover:bg-slate-200/50' : '',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex flex-col md:flex-row items-center justify-between space-x-2 py-4">
          <div className="flex items-center w-full justify-between md:justify-start md:space-x-10 mb-4 md:mb-0">
            <div className="flex items-center justify-center space-x-4">
              <p className=" text-sm !font-normal !mb-0 mr-1">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRows > 0 && (
              <p className="text-sm !font-normal text-muted-foreground !mb-0">
                {selectedRows} of {table.getFilteredRowModel().rows.length}{' '}
                row(s) selected.
              </p>
            )}
          </div>
          <Pagination className="w-auto !mb-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    if (table.getCanPreviousPage()) {
                      table.previousPage()
                    }
                  }}
                  className={cn(
                    'h-8 px-2',
                    !table.getCanPreviousPage() &&
                      'pointer-events-none opacity-50',
                  )}
                />
              </PaginationItem>

              {getPaginationRange(
                table.getState().pagination.pageIndex,
                table.getPageCount(),
              ).map((page, index) =>
                page === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={
                        table.getState().pagination.pageIndex + 1 === page
                      }
                      onClick={(event) => {
                        event.preventDefault()
                        table.setPageIndex(page - 1)
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
                    if (table.getCanNextPage()) {
                      table.nextPage()
                    }
                  }}
                  className={cn(
                    'h-8 px-2',
                    !table.getCanNextPage() && 'pointer-events-none opacity-50',
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

// Helper components for common column patterns
interface DataTableColumnHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  column: any
  title: string
}

function DataTableColumnHeader({
  column,
  title,
  className,
}: DataTableColumnHeaderProps) {
  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          'font-normal text-muted-foreground cursor-default',
          className,
        )}
      >
        {title}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <button
        type="button"
        className="group cursor-pointer flex items-center space-x-2 text-muted-foreground font-normal hover:bg-none data-[state=open]:bg-none focus-visible:outline-none focus-visible:none focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm disabled:pointer-events-none disabled:opacity-50"
        aria-label={`Sort column ${title}`}
        onClick={() => {
          const sorted = column.getIsSorted()
          if (!sorted) {
            column.toggleSorting(false)
          } else if (sorted === 'asc') {
            column.toggleSorting(true)
          } else {
            column.clearSorting()
          }
        }}
      >
        <span>{title}</span>
        {!column.getIsSorted() && (
          <ChevronsUpDownIcon className="h-4 w-4 opacity-0 group-hover:opacity-30 transition-opacity" />
        )}
        {column.getIsSorted() === 'desc' ? (
          <span className="flex items-center justify-center h-4 w-4">
            <ChevronDownIcon className="h-3 w-3" />
          </span>
        ) : (
          column.getIsSorted() === 'asc' && (
            <span className="flex items-center justify-center h-4 w-4">
              <ChevronDownIcon className="h-3 w-3 rotate-180" />
            </span>
          )
        )}
      </button>
    </div>
  )
}

// Row actions component
interface DataTableRowActionsProps<TData> {
  row: any
  actions?: {
    label: string
    onClick: (row: TData) => void
    variant?: 'default' | 'destructive'
  }[]
}

function DataTableRowActions<TData>({
  row,
  actions = [],
}: DataTableRowActionsProps<TData>) {
  if (actions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(row.original)}
            variant={action.variant}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Selection checkbox component
function DataTableSelectCheckbox({ table }: { table: any }) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  )
}

function DataTableSelectRowCheckbox({ row }: { row: any }) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  )
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  DataTableSelectCheckbox,
  DataTableSelectRowCheckbox,
  type DataTableProps,
}
