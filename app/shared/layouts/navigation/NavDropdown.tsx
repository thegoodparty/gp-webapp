'use client'
import Link from 'next/link'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { FaChevronDown } from 'react-icons/fa'
import { OpenInNewRounded } from '@mui/icons-material'
import { memo } from 'react'

interface NavLink {
  href: string
  id: string
  label: string
  external?: boolean
  icon?: React.ReactNode
  dataTestId?: string
}

interface NavDropdownProps {
  open: boolean
  dataTestId?: string
  toggleCallback: () => void
  links: NavLink[]
  label?: string
  id: string
}

const NavDropdown = ({
  open,
  dataTestId = '',
  toggleCallback,
  links,
  label = '',
  id,
}: NavDropdownProps): React.JSX.Element => (
  <div className="lg:ml-2 xl:ml-4 relative cursor-pointer ">
    <PrimaryButton
      id={id}
      onClick={toggleCallback}
      variant="text"
      size="medium"
    >
      <div className="flex items-center">
        <div className="font-medium text-base" data-testid={dataTestId}>
          {label}
        </div>
        <FaChevronDown
          className={`ml-2 mt-[2px] transition-all ${open && 'rotate-180'}`}
        />
      </div>
    </PrimaryButton>

    {open ? (
      <>
        <div
          className="fixed h-screen w-screen top-14 left-0 "
          onClick={toggleCallback}
        />
        <div
          className={`absolute z-50 top-11 left-0 min-w-[270px] bg-primary-dark text-white rounded-xl shadow-md transition  ${
            open ? 'p-3 overflow-hidden' : 'p-0 opacity-0 overflow-visible'
          }`}
        >
          {links.map((link) => (
            <Link
              href={link.href}
              id={`nav-${link.id}`}
              key={link.id}
              className="no-underline font-medium block py-3 whitespace-nowrap text-base px-4 hover:bg-primary-dark-dark rounded flex items-center justify-between"
              rel={link.external ? 'noopener noreferrer nofollow' : ''}
              target={link.external ? '_blank' : ''}
            >
              <div
                className="flex items-center"
                data-testid={link.dataTestId}
              >
                {link.icon}
                <div className="ml-3">{link.label}</div>
              </div>
              {link.external && <OpenInNewRounded />}
            </Link>
          ))}
        </div>
      </>
    ) : null}
  </div>
)

export default memo(NavDropdown)

