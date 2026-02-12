'use client'

import { usePathname } from 'next/navigation'
import { NavDropdowns } from '@shared/layouts/navigation/NavDropdowns'
import { useMemo } from 'react'
import NavButton from './NavButton'

const HIDE_NAV_PATHS = ['/onboarding', '/dashboard', '/profile', '/polls']

const LeftSide = (): React.JSX.Element | null => {
  const pathname = usePathname()
  const shouldHideNav = useMemo(
    () => HIDE_NAV_PATHS.some((path) => pathname?.startsWith(path)),
    [pathname],
  )

  if (shouldHideNav) {
    return null
  }

  return (
    <div className="items-center hidden lg:flex">
      <NavDropdowns dropdownIndices={[0, 1]} />

      <NavButton href="/pricing" id="nav-pricing" className="lg:ml-3 xl:ml-6">
        <span className="font-medium text-base" data-testid="nav-pricing">
          Pricing
        </span>
      </NavButton>

      <NavDropdowns dropdownIndices={[2]} />
    </div>
  )
}

export default LeftSide
