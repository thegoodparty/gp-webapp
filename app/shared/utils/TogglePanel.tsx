'use client'

import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import H4 from '@shared/typography/H4'
import Image from 'next/image'
import { useState, ReactNode } from 'react'
import { FiChevronUp, FiChevronDown } from 'react-icons/fi'

interface TogglePanelProps {
  icon?: string | ReactNode
  label?: string
  forceExpand?: boolean
  children?: ReactNode
  openCallback?: (isOpen: boolean) => void
  [key: string]: unknown
}

const TogglePanel = ({
  icon,
  label = '',
  forceExpand,
  children,
  openCallback,
  ...restProps
}: TogglePanelProps) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = (): void => {
    setOpen(!open)
    if (openCallback) {
      openCallback(!open)
    }
  }

  return (
    <>
      <div
        className={`bg-slate-200 py-5 px-7 flex items-center justify-between cursor-pointer mt-2 ${
          open ? 'rounded-t-xl' : 'rounded-xl'
        }`}
        data-testid="faq-expandable"
        onClick={toggleOpen}
        {...restProps}
      >
        <div className="flex items-center">
          {icon && (
            <>
              {typeof icon === 'string' ? (
                <Image
                  src={icon}
                  width={22}
                  height={28}
                  alt=""
                  className="mr-4"
                  priority
                />
              ) : (
                <div className="mr-4">{icon}</div>
              )}
            </>
          )}
          <H4>{label}</H4>
        </div>
        <div className="flex items-center">
          {open ? (
            <PrimaryButton
              size="medium"
              ariaLabel="collapse"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <FiChevronUp />
            </PrimaryButton>
          ) : (
            <SecondaryButton
              size="medium"
              ariaLabel="expand"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <FiChevronDown />
            </SecondaryButton>
          )}
        </div>
      </div>
      {(forceExpand || open) && (
        <div className="bg-slate-200 px-3 pt-1 pb-3 lg:pt-4 lg:pb-7 lg:px-7 rounded-b-xl">
          {children}
        </div>
      )}
    </>
  )
}

export default TogglePanel

