import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { PeopleProvider } from './components/PeopleProvider'
import PeoplePage from './components/PeoplePage'
import {
  TEMP_SAMPLE_PEOPLE_FULL_PAGE1,
  TEMP_SAMPLE_PEOPLE_FULL_PAGE2,
} from './components/temp-sample-people-full'

const fetchPeople = async (page = 1, pageSize = 25) => {
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

const meta = pageMetaData({
  title: 'People | GoodParty.org',
  description: 'Manage your campaign people.',
  slug: '/dashboard/people',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }) {
  await adminAccessOnly()
  const params = await searchParams

  const page = parseInt(params.page || '1')
  const pageSize = parseInt(params.pageSize || '20')

  const people = await fetchPeople(page, pageSize)

  return (
    <PeopleProvider people={people}>
      <PeoplePage />
    </PeopleProvider>
  )
}
