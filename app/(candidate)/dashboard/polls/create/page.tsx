import pageMetaData from 'helpers/metadataHelper'
import FeatureFlagGuard from '@shared/experiments/FeatureFlagGuard'
import { CreatePoll } from './CreatePoll'

export const metadata = pageMetaData({
  title: 'Create Poll | GoodParty.org',
  description: 'Create Poll',
  slug: '/dashboard/polls',
})

export default async function Page() {
  return (
    <FeatureFlagGuard flagKey="serve-poll-creation">
      <CreatePoll pathname="/dashboard/polls" />
    </FeatureFlagGuard>
  )
}
