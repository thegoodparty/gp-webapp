import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { PeopleProvider } from './components/PeopleProvider'
import PeoplePage from './components/PeoplePage'
import {
  TEMP_SAMPLE_PEOPLE_FULL_PAGE1,
  TEMP_SAMPLE_PEOPLE_FULL_PAGE2,
} from './components/temp-sample-people-full'

const fetchPeople = async (page = 1) => {
  if (page === 1) {
    return TEMP_SAMPLE_PEOPLE_FULL_PAGE1
  }
  return TEMP_SAMPLE_PEOPLE_FULL_PAGE2
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

  const people = await fetchPeople(searchParams.page)
  console.log('people', people)
  return (
    <PeopleProvider people={people}>
      <PeoplePage />
    </PeopleProvider>
  )
}
