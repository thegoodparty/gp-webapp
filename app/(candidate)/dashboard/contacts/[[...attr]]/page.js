import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { ContactsProvider } from './hooks/ContactsProvider'
import ContactsPage from './components/ContactsPage'
import { TEMP_SAMPLE_PEOPLE_FULL_PAGE1 } from './components/temp/temp-sample-people-full'
import { PersonProvider } from './hooks/PersonProvider'
import { SegmentProvider } from './hooks/SegmentProvider'
import { CustomSegmentsProvider } from './hooks/CustomSegmentsProvider'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

const fetchContacts = async ({
  state,
  districtType,
  districtName,
  page = 1,
  resultsPerPage = 50,
}) => {
  const payload = {
    state,
    districtType,
    districtName,
    page,
    resultsPerPage,
  }
  const response = await serverFetch(apiRoutes.contacts.list, payload)
  if (response.ok) {
    return response.data
  } else {
    console.error('Failed to fetch contacts', response)
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
  pageSize = parseInt(pageSize || '50')
  const state = 'NC'
  const districtType = 'City'
  const districtName = 'HENDERSONVILLE CITY'

  const contacts = await fetchContacts({
    state,
    districtType,
    districtName,
    page,
    pageSize,
  })
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
