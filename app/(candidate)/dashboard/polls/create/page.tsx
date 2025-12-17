import pageMetaData from 'helpers/metadataHelper'
import FeatureFlagGuard from '@shared/experiments/FeatureFlagGuard'
import { CreatePoll } from './CreatePoll'
import serveAccess from '../../shared/serveAccess'

export const metadata = pageMetaData({
  title: 'Create Poll | GoodParty.org',
  description: 'Create Poll',
  slug: '/dashboard/polls/create',
})

export default async function Page() {
  await serveAccess()
  return (
    <FeatureFlagGuard flagKey="serve-poll-creation">
      <CreatePoll pathname="/dashboard/polls" />
    </FeatureFlagGuard>
  )
}
