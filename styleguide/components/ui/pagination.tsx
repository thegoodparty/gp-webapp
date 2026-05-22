import * as React from 'react'
import { cva } from 'class-variance-authority'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from './icons'

import { cn } from '../../lib/utils'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        'flex flex-row items-center gap-1 !m-0 !p-0 !list-none',
        className,
      )}
      {...props}
    />
  )
}

function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="pagination-item"
      className={cn('!mb-0', className)}
      {...props}
    />
  )
}

const paginationLinkVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-transparent px-3 text-sm font-normal text-foreground no-underline transition-colors outline-none hover:bg-base-accent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      isActive: {
        true: 'border-base-border',
        false: '',
      },
      size: {
        xSmall: 'h-6',
        small: 'h-8',
        medium: 'h-10',
        large: 'h-12',
      },
    },
    defaultVariants: {
      isActive: false,
      size: 'small',
    },
  },
)

type PaginationLinkProps = {
  isActive?: boolean
  size?: 'xSmall' | 'small' | 'medium' | 'large'
} & React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'small',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(paginationLinkVariants({ isActive, size }), className)}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="medium"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="medium"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
