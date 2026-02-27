'use client'

import H4 from '@shared/typography/H4'
import { useState, ReactNode, HTMLAttributes } from 'react'
import { FaChevronRight } from 'react-icons/fa'

interface ListItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: 'list' | string
  title: string
  number?: number
  children?: ReactNode
}

const ListItem = ({
  variant = 'list',
  title,
  number,
  children,
  ...restProps
}: ListItemProps) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-6">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          setOpen(!open)
        }}
        {...restProps}
      >
        {variant === 'list' && (
          <div className="mr-5 h-6 w-6 bg-primary-dark text-slate-50 flex items-center justify-center rounded-full font-semibold">
            {number}
          </div>
        )}
        <H4>{title}</H4>
        <FaChevronRight
          className={`ml-4 transition-all duration-300 ${open && '-rotate-90'}`}
        />
      </div>
      {open && (
        <div className="ml-7 mt-4 bg-indigo-50 rounded-xl p-4 lg:py-5 lg:px-6">
          {children}
        </div>
      )}
    </div>
  )
}

export default ListItem
