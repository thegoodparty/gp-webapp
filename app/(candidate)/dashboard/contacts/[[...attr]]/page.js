import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { ContactsProvider } from './providers/ContactsProvider'
import ContactsPage from './components/ContactsPage'
import {
  TEMP_SAMPLE_PEOPLE_FULL_PAGE1,
  TEMP_SAMPLE_PEOPLE_FULL_PAGE2,
} from './components/temp/temp-sample-people-full'
import { PersonProvider } from './providers/PersonProvider'
import { SegmentProvider } from './providers/SegmentProvider'
import { CustomSegmentsProvider } from './providers/CustomSegmentsProvider'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

const fetchContacts = async (page = 1, pageSize = 25) => {
  // Simulate API response with pagination metadata
  let data
  if (page === 1) {
    data = TEMP_SAMPLE_PEOPLE_FULL_PAGE1
  } else {
    data = TEMP_SAMPLE_PEOPLE_FULL_PAGE2
  }

  // Simulate pagination
  const totalItems = 1000 // Total items in your dataset
  const totalPages = Math.ceil(totalItems / pageSize)

  return {
    data,
    pagination: {
      currentPage: page,
      pageSize,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

const fetchPerson = async (personId) => {
  return TEMP_SAMPLE_PEOPLE_FULL_PAGE1.find(
    (person) => person.LALVOTERID === personId,
  )
}

const fetchCustomSegments = async () => {
  const response = await serverFetch(apiRoutes.segments.list)
  return response.data || []
}

const meta = pageMetaData({
  title: 'Contacts  | GoodParty.org',
  description: 'Manage your campaign contacts.',
  slug: '/dashboard/contacts',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }) {
  await adminAccessOnly()
  let { page, pageSize } = await searchParams
  let { attr } = await params
  let personId = null
  let person = null

  if (attr && attr.length === 1) {
    personId = attr[0]
    person = await fetchPerson(personId)
  }

  page = parseInt(page || '1')
  pageSize = parseInt(pageSize || '20')

  const contacts = await fetchContacts(page, pageSize)
  const initCustomSegments = await fetchCustomSegments()

  return (
    <ContactsProvider contacts={contacts}>
      <PersonProvider person={person}>
        <SegmentProvider>
          <CustomSegmentsProvider customSegments={initCustomSegments}>
            <ContactsPage />
          </CustomSegmentsProvider>
        </SegmentProvider>
      </PersonProvider>
    </ContactsProvider>
  )
}
