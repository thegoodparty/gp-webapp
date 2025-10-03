import pageMetaData from 'helpers/metadataHelper'
import { ContactsProvider } from './hooks/ContactsProvider'
import ContactsPage from './components/ContactsPage'
import { PersonProvider } from './hooks/PersonProvider'
import { CustomSegmentsProvider } from './hooks/CustomSegmentsProvider'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { DEFAULT_PAGE_SIZE } from './components/shared/constants'
import candidateAccess from '../../shared/candidateAccess'

const fetchContacts = async ({
  page = 1,
  resultsPerPage = DEFAULT_PAGE_SIZE,
  segment = 'all',
}) => {
  const payload = {
    page,
    resultsPerPage,
    segment,
  }
  const response = await serverFetch(apiRoutes.contacts.list, payload, {
    next: {
      revalidate: 3600,
    },
  })
  if (response.ok) {
    return response.data
  } else {
    console.warn('Failed to fetch contacts', response)
    return {
      people: [],
      pagination: {
        currentPage: page,
        pageSize: resultsPerPage,
        totalPages: 0,
        totalItems: 0,
      },
    }
  }
}

const fetchPerson = async (personId) => {
  const response = await serverFetch(
    apiRoutes.contacts.get,
    { id: personId },
    {
      next: {
        revalidate: 3600,
      },
    },
  )
  if (response.ok) {
    return response.data
  } else {
    console.warn('Failed to fetch person', response)
    return null
  }
}

const fetchCustomSegments = async () => {
  const response = await serverFetch(apiRoutes.voterFileFilter.list)
  if (response.ok) {
    return response.data || []
  } else {
    console.warn('Failed to fetch custom segments', response)
    return []
  }
}

const fetchPeopleStats = async () => {
  const response = await serverFetch(
    apiRoutes.contacts.stats,
    {},
    {
      next: {
        revalidate: 3600,
      },
    },
  )
  if (response.ok) {
    return response.data || {}
  } else {
    console.warn('Failed to fetch people stats', response)
    return {}
  }
}

const meta = pageMetaData({
  title: 'Contacts  | GoodParty.org',
  description: 'Manage your campaign contacts.',
  slug: '/dashboard/contacts',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }) {
  await candidateAccess()
  let { page, pageSize, segment } = await searchParams
  let { attr } = await params
  let personId = null
  let person = null

  if (attr && attr.length === 1) {
    personId = attr[0]
    person = await fetchPerson(personId)
  }

  page = parseInt(page || '1')
  pageSize = parseInt(pageSize || DEFAULT_PAGE_SIZE)

  const [contacts, initCustomSegments, peopleStats] = await Promise.all([
    fetchContacts({
      page,
      resultsPerPage: pageSize,
      segment,
    }),
    fetchCustomSegments(),
    fetchPeopleStats(),
  ])

  return (
    <ContactsProvider contacts={contacts}>
      <PersonProvider person={person}>
        <CustomSegmentsProvider
          customSegments={initCustomSegments}
          querySegment={segment}
        >
          <ContactsPage peopleStats={peopleStats} />
        </CustomSegmentsProvider>
      </PersonProvider>
    </ContactsProvider>
  )
}
