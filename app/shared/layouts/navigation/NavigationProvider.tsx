'use client'
import { createContext, useCallback, useEffect, useState } from 'react'

import {
  LuHammer,
  LuFiles,
  LuFolderHeart,
  LuSmartphone,
  LuSignpost,
  LuBanknote,
  LuTrophy,
  LuLandmark,
  LuBookOpen,
  LuNewspaper,
  LuFileText,
  LuUsersRound,
  LuPhone,
  LuSquarePlay,
  LuContactRound,
  LuHeart,
  LuMessageCircle,
} from 'react-icons/lu'

import { usePathname } from 'next/navigation'
import { getMarketingUrl } from 'helpers/linkhelper'

interface NavLink {
  label: string
  href: string
  icon: React.ReactElement
  id: string
  dataTestId: string
  external?: boolean
}

export const PRODUCT_LINKS: NavLink[] = [
  {
    label: 'Campaign Toolkit',
    href: getMarketingUrl('/run-for-office'),
    icon: <LuHammer />,
    id: 'nav-campaign-tools',
    dataTestId: 'nav-campaign-tools',
    external: true,
  },
  {
    label: 'Template Library',
    href: getMarketingUrl('/templates'),
    icon: <LuFiles />,
    id: 'nav-template-library',
    dataTestId: 'nav-template-library',
    external: true,
  },
  {
    label: 'Voter Data',
    href: getMarketingUrl('/voter-data'),
    icon: <LuFolderHeart />,
    id: 'nav-voter-data',
    dataTestId: 'nav-voter-data',
    external: true,
  },
  {
    label: 'Texting',
    href: getMarketingUrl('/sms-tools'),
    icon: <LuSmartphone />,
    id: 'nav-texting',
    dataTestId: 'nav-texting',
    external: true,
  },
  {
    label: 'Yard Signs',
    href: getMarketingUrl('/yard-signs'),
    icon: <LuSignpost />,
    id: 'nav-yard-signs',
    dataTestId: 'nav-yard-signs',
    external: true,
  },
  {
    label: 'Serve',
    href: getMarketingUrl('/serve'),
    icon: <LuMessageCircle />,
    id: 'nav-serve',
    dataTestId: 'nav-serve',
    external: true,
  },
  {
    label: 'Pricing',
    href: getMarketingUrl('/pricing'),
    icon: <LuBanknote />,
    id: 'nav-pricing',
    dataTestId: 'nav-pricing',
    external: true,
  },
  {
    label: 'GoodParty.org Pro',
    href: getMarketingUrl('/pro-lp'),
    icon: <LuTrophy />,
    id: 'nav-good-party-pro',
    dataTestId: 'nav-good-party-pro',
    external: true,
  },
]

export const RESOURCES_LINKS: NavLink[] = [
  {
    label: 'Talk to an Expert',
    href: getMarketingUrl('/get-a-demo'),
    icon: <LuContactRound />,
    id: 'nav-get-demo',
    dataTestId: 'nav-get-demo',
    external: true,
  },
  {
    label: 'Product Tour',
    href: getMarketingUrl('/product-tour'),
    icon: <LuSquarePlay />,
    id: 'nav-tour',
    dataTestId: 'nav-tour',
    external: true,
  },
  {
    label: 'Find Offices to Run For',
    href: getMarketingUrl('/elections'),
    icon: <LuLandmark />,
    id: 'nav-explore-offices',
    dataTestId: 'nav-explore-offices',
    external: true,
  },
  {
    label: 'How to Run for Office',
    href: getMarketingUrl('/e-book'),
    icon: <LuBookOpen />,
    id: 'nav-how-to-run',
    dataTestId: 'nav-how-to-run',
    external: true,
  },
  {
    label: 'Blog',
    href: getMarketingUrl('/blog'),
    icon: <LuNewspaper />,
    id: 'nav-blog',
    dataTestId: 'nav-blog',
    external: true,
  },
  {
    label: 'Candidate Community',
    href: 'https://community.goodparty.org',
    icon: <LuUsersRound />,
    id: 'nav-community',
    dataTestId: 'nav-community',
    external: true,
  },
  {
    label: 'Case Studies',
    href: getMarketingUrl('/blog/section/for-candidates'),
    icon: <LuFileText />,
    id: 'nav-case-studies',
    dataTestId: 'nav-case-studies',
    external: true,
  },
]

export const ABOUT_US_LINKS: NavLink[] = [
  {
    label: 'Our Mission',
    href: getMarketingUrl('/about'),
    icon: <LuHeart />,
    id: 'nav-about',
    dataTestId: 'nav-about',
    external: true,
  },
  {
    label: 'Our Team',
    href: getMarketingUrl('/team'),
    icon: <LuUsersRound />,
    id: 'nav-team',
    dataTestId: 'nav-team',
    external: true,
  },
  {
    label: 'Contact Us',
    href: getMarketingUrl('/contact'),
    icon: <LuPhone />,
    id: 'nav-contact-us',
    dataTestId: 'nav-contact-us',
    external: true,
  },
]

export interface Dropdown {
  id: string
  label: string
  dataTestId: string
  links: NavLink[]
}

const DROPDOWNS: Dropdown[] = [
  {
    id: 'nav-product',
    label: 'Product',
    dataTestId: 'nav-product',
    links: PRODUCT_LINKS,
  },
  {
    id: 'nav-resources',
    label: 'Resources',
    dataTestId: 'nav-resources',
    links: RESOURCES_LINKS,
  },
  {
    id: 'nav-about-us',
    label: 'About Us',
    dataTestId: 'nav-about-us',
    links: ABOUT_US_LINKS,
  },
]
const INITIAL_OPEN_STATES = Array(DROPDOWNS.length).fill(false)

interface NavContextValue {
  dropdowns: Dropdown[]
  openStates: boolean[]
  toggle: (index: number) => () => void
  closeAll: () => void
}

export const NavContext = createContext<NavContextValue>({
  dropdowns: DROPDOWNS,
  openStates: INITIAL_OPEN_STATES,
  toggle: () => () => {},
  closeAll: () => {},
})

interface NavigationProviderProps {
  children: React.ReactNode
}

export const NavigationProvider = ({
  children,
}: NavigationProviderProps): React.JSX.Element => {
  const [openStates, setOpenStates] = useState(INITIAL_OPEN_STATES)
  const pathname = usePathname()

  const closeAll = useCallback(() => setOpenStates(INITIAL_OPEN_STATES), [])

  const makeNewOpenStates = (index: number) => [
    ...openStates.slice(0, index).fill(false),
    !openStates[index],
    ...openStates.slice(index + 1).fill(false),
  ]

  useEffect(() => {
    closeAll()
  }, [pathname, closeAll])

  return (
    <NavContext.Provider
      value={{
        dropdowns: DROPDOWNS,
        openStates,
        toggle: (index) => () => {
          setOpenStates(makeNewOpenStates(index))
        },
        closeAll,
      }}
    >
      {children}
    </NavContext.Provider>
  )
}
