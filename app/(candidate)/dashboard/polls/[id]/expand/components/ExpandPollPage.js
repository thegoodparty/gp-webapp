'use client'

import { useCampaign } from '@shared/hooks/useCampaign'
import Crumbs from '../../../shared/Crumbs'
import { usePoll } from '../../../shared/hooks/PollProvider'
import PollsPageGuard from '../../../components/PollsPageGuard'
import Paper from '@shared/utils/Paper'
import TitleSection from './TitleSection'
import SelectSection from './SelectSection'

export default function PollIssueDetailPage() {
  const [campaign] = useCampaign()
  const [poll] = usePoll()

  const breadcrumbsLinks = [
    { href: `/dashboard/polls`, label: 'Polls' },
    {
      label: `${poll.name}`,
      href: `/dashboard/polls/${poll.id}`,
    },
    {
      label: 'Expand Poll',
    },
  ]

  return (
    <div className="bg-indigo-100 min-h-screen p-4 md:p-8">
      <PollsPageGuard>
        <Crumbs breadcrumbsLinks={breadcrumbsLinks} />

        <Paper className="min-h-full max-w-[700px] mx-auto mt-8 md:mt-16">
          <TitleSection />
          <SelectSection />
        </Paper>
      </PollsPageGuard>
    </div>
  )
}
