import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { PeopleProvider } from './PeopleProvider'
import TEMP_SAMPLE_PEOPLE from './temp-sample-people'
import PeoplePage from './components/PeoplePage'

const fetchPeople = async () => {
  return TEMP_SAMPLE_PEOPLE
}

const meta = pageMetaData({
  title: 'People | GoodParty.org',
  description: 'Manage your campaign people.',
  slug: '/dashboard/people',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page() {
  await adminAccessOnly()

  const people = await fetchPeople()
  return (
    <PeopleProvider people={people}>
      <PeoplePage />
    </PeopleProvider>
  )
}
