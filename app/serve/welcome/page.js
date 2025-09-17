import pageMetaData from 'helpers/metadataHelper'

import ServePage from './components/ServePage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve',
  description: 'Welcome to GoodParty.org Serve',
  slug: '/serve',
})

export const metadata = meta

export default async function Page({ searchParams }) {
  await candidateAccess()
  const childProps = {}

  return <ServePage {...childProps} />
}
