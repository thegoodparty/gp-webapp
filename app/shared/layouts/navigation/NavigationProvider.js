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
  LuUserSearch,
  LuSquarePlay,
  LuContactRound,
  LuHeart,
} from 'react-icons/lu'

import { usePathname } from 'next/navigation'

export const PRODUCT_LINKS = [
  {
    label: 'Campaign Toolkit',
    href: '/run-for-office',
    icon: <LuHammer />,
    id: 'nav-campaign-tools',
    dataTestId: 'nav-campaign-tools',
  },
  {
    label: 'Template Library',
    href: 'https://lp.goodparty.org/template-library',
    icon: <LuFiles />,
    id: 'nav-template-library',
    dataTestId: 'nav-template-library',
    external: true,
  },
  {
    label: 'Voter Data',
    href: 'https://lp.goodparty.org/voter-data',
    icon: <LuFolderHeart />,
    id: 'nav-voter-data',
    dataTestId: 'nav-voter-data',
    external: true,
  },
  {
    label: 'Texting',
    href: 'https://lp.goodparty.org/sms-tools',
    icon: <LuSmartphone />,
    id: 'nav-texting',
    dataTestId: 'nav-texting',
    external: true,
  },
  {
    label: 'Yard Signs',
    href: 'https://lp.goodparty.org/yard-signs',
    icon: <LuSignpost />,
    id: 'nav-yard-signs',
    dataTestId: 'nav-yard-signs',
    external: true,
  },
  {
    label: 'Pricing',
    href: '/pricing',
    icon: <LuBanknote />,
    id: 'nav-pricing',
    dataTestId: 'nav-pricing',
  },
  {
    label: 'GoodParty.org Pro',
    href: 'https://lp.goodparty.org/pro-lp',
    icon: <LuTrophy />,
    id: 'nav-good-party-pro',
    dataTestId: 'nav-good-party-pro',
    external: true,
  },
]

export const RESOURCES_LINKS = [
  {
    label: 'Talk to an Expert',
    href: '/get-a-demo',
    icon: <LuContactRound />,
    id: 'nav-get-demo',
    dataTestId: 'nav-get-demo',
  },
  {
    label: 'Product Tour',
    href: '/product-tour',
    icon: <LuSquarePlay />,
    id: 'nav-tour',
    dataTestId: 'nav-tour',
  },
  {
    label: 'Find Offices to Run For',
    href: '/elections',
    icon: <LuLandmark />,
    id: 'nav-explore-offices',
    dataTestId: 'nav-explore-offices',
  },
  {
    label: 'How to Run for Office',
    href: 'https://lp.goodparty.org/e-book',
    icon: <LuBookOpen />,
    id: 'nav-how-to-run',
    dataTestId: 'nav-how-to-run',
    external: true,
  },
  {
    label: 'Blog',
    href: '/blog',
    icon: <LuNewspaper />,
    id: 'nav-blog',
    dataTestId: 'nav-blog',
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
    href: '/blog/section/for-candidates',
    icon: <LuFileText />,
    id: 'nav-case-studies',
    dataTestId: 'nav-case-studies',
  },
]

export const ABOUT_US_LINKS = [
  {
    label: 'Our Mission',
    href: '/about',
    icon: <LuHeart />,
    id: 'nav-about',
    dataTestId: 'nav-about',
  },
  {
    label: 'Our Team',
    href: '/team',
    icon: <LuUsersRound />,
    id: 'nav-team',
    dataTestId: 'nav-team',
  },
  {
    label: 'GoodParty.org Candidates',
    href: '/candidates',
    icon: <LuUserSearch />,
    id: 'nav-find-candidates',
    dataTestId: 'nav-find-candidates',
  },
  {
    label: 'Contact Us',
    href: '/contact',
    icon: <LuPhone />,
    id: 'nav-contact-us',
    dataTestId: 'nav-contact-us',
  },
]

const DROPDOWNS = [
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

export const NavContext = createContext({
  dropdowns: DROPDOWNS,
  openStates: INITIAL_OPEN_STATES,
  toggle: () => {},
  closeAll: () => {},
})

export const NavigationProvider = ({ children }) => {
  const [openStates, setOpenStates] = useState(INITIAL_OPEN_STATES)
  const pathname = usePathname()

  const closeAll = useCallback(
    () => setOpenStates(INITIAL_OPEN_STATES),
    [setOpenStates],
  )

  const makeNewOpenStates = (index) => [
    ...openStates.slice(0, index).fill(false),
    !openStates[index],
    ...openStates.slice(index + 1).fill(false),
  ]

  useEffect(closeAll, [pathname])

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
