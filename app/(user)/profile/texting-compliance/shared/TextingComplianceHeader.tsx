'use client'

import { MdArrowBack } from 'react-icons/md'
import Button from '@shared/buttons/Button'

interface TextingComplianceHeaderProps {
  children: React.ReactNode
}

export default function TextingComplianceHeader({
  children,
}: TextingComplianceHeaderProps): React.JSX.Element {
  return (
    <header
      className="
      fixed
      left-0
      right-0
      top-0
      z-[1301]
      border-b
      border-gray-200
      bg-white
      px-4
      py-4
      md:px-8
      md:py-4
    "
    >
      <div className="flex items-center justify-between">
        <Button
          href="/profile"
          color="neutral"
          variant="text"
          className="md:hidden"
        >
          <MdArrowBack className="text-lg" />
        </Button>

        {children}

        <Button
          href="/profile"
          color="neutral"
          variant="outlined"
          className="hidden rounded-full px-6 py-2 md:flex"
        >
          Exit
        </Button>
      </div>
    </header>
  )
}
