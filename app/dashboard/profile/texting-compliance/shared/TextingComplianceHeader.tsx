'use client'

import { MdArrowBack } from 'react-icons/md'
import { Button } from '@styleguide'
import Link from 'next/link'

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
        <Button asChild variant="ghost" className="md:hidden">
          <Link href="/dashboard/profile">
            <MdArrowBack className="text-lg" />
          </Link>
        </Button>

        {children}

        <Button
          asChild
          variant="outline"
          className="hidden rounded-full px-6 py-2 md:flex"
        >
          <Link href="/dashboard/profile">Exit</Link>
        </Button>
      </div>
    </header>
  )
}
