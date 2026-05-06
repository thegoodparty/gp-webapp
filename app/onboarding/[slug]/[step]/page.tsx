export const dynamic = 'force-dynamic'

import pageMetaData from 'helpers/metadataHelper'
import { redirect } from 'next/navigation'

const meta = pageMetaData({
  title: 'Candidate Onboarding | GoodParty.org',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  redirect('/onboarding/office-selection')
}
