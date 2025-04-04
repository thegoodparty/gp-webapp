'use client'
import { createContext, useCallback, useEffect, useState } from 'react'

import {
  ConstructionRounded,
  EmojiEventsRounded,
  GroupRounded,
  FolderSharedRounded,
  LibraryBooksRounded,
  SlideshowRounded,
  SearchRounded,
  VolunteerActivismRounded,
  EventAvailableRounded,
  MailRounded,
  NewspaperRounded,
  ListRounded,
  Diversity3,
} from '@mui/icons-material'

import MapIcon from '@mui/icons-material/Map'

import { usePathname } from 'next/navigation'

export const RUN_LINKS = [
  {
    label: 'Campaign Tools',
    href: '/run-for-office',
    icon: <ConstructionRounded />,
    id: 'nav-campaign-tools',
    dataTestId: 'nav-campaign-tools',
  },
  {
    label: 'GoodParty.org Pro',
    href: 'https://lp.goodparty.org/pro-lp/',
    icon: <EmojiEventsRounded />,
    id: 'nav-good-party-pro',
    dataTestId: 'nav-good-party-pro',
    external: true,
  },
  {
    label: 'Get a Demo',
    href: '/get-a-demo',
    icon: <GroupRounded />,
    id: 'nav-get-demo',
    dataTestId: 'nav-get-demo',
  },
  {
    label: 'Voter Data',
    href: 'https://lp.goodparty.org/voter-data',
    icon: <FolderSharedRounded />,
    id: 'nav-voter-data',
    dataTestId: 'nav-voter-data',
    external: true,
  },
  {
    label: 'Template Library',
    href: 'https://lp.goodparty.org/template-library',
    icon: <LibraryBooksRounded />,
    id: 'nav-template-library',
    dataTestId: 'nav-template-library',
    external: true,
  },
  {
    label: 'Product Tour',
    href: '/product-tour',
    icon: <SlideshowRounded />,
    id: 'nav-tour',
    dataTestId: 'nav-tour',
  },
  {
    label: 'Explore Offices',
    href: '/elections',
    icon: <SearchRounded />,
    id: 'nav-explore-offices',
    dataTestId: 'nav-explore-offices',
  },
]

export const COMMUNITY_LINKS = [
  {
    label: 'Volunteer',
    href: '/volunteer',
    icon: <VolunteerActivismRounded />,
    id: 'nav-volunteer',
    dataTestId: 'nav-volunteer',
  },
  {
    label: 'Find Candidates',
    href: '/candidates',
    icon: <MapIcon />,
    id: 'nav-find-candidates',
    dataTestId: 'nav-find-candidates',
  },
  {
    label: 'Info Session',
    href: '/info-session',
    icon: <EventAvailableRounded />,
    id: 'nav-info-session',
    dataTestId: 'nav-info-session',
  },
  {
    label: 'Get Stickers',
    href: '/get-stickers',
    icon: <MailRounded />,
    id: 'nav-get-stickers',
    dataTestId: 'nav-get-stickers',
  },
  {
    label: 'GoodParty.org Community',
    href: 'https://community.goodparty.org',
    icon: <Diversity3 />,
    id: 'nav-community',
    dataTestId: 'nav-community',
    external: true,
  },
]
export const RESOURCES_LINKS = [
  {
    label: 'Blog',
    href: '/blog',
    icon: <NewspaperRounded />,
    id: 'nav-blog',
    dataTestId: 'nav-blog',
  },
  {
    label: 'Glossary',
    href: '/political-terms',
    icon: <ListRounded />,
    id: 'nav-glossary',
    dataTestId: 'nav-glossary',
  },
]
const DROPDOWNS = [
  {
    id: 'nav-candidates',
    label: 'For Candidates',
    dataTestId: 'nav-candidates',
    links: RUN_LINKS,
  },
  {
    id: 'nav-voters',
    label: 'For Voters',
    dataTestId: 'nav-voters',
    links: COMMUNITY_LINKS,
  },
  {
    id: 'nav-resources',
    label: 'Resources',
    dataTestId: 'nav-resources',
    links: RESOURCES_LINKS,
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
