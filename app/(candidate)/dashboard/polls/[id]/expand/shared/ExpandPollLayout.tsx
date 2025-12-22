'use client'

import Paper from '@shared/utils/Paper'
import Crumbs from '../../../shared/Crumbs'
import { usePoll } from '../../../shared/hooks/PollProvider'
import FeatureFlagGuard from '@shared/experiments/FeatureFlagGuard'

interface ExpandPollLayoutProps {
  children: React.ReactNode
  showBreadcrumbs?: boolean
}

export default function ExpandPollLayout({
  children,
  showBreadcrumbs = true,
}: ExpandPollLayoutProps): React.JSX.Element {
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
      <FeatureFlagGuard flagKey="serve-polls-expansion">
        {showBreadcrumbs && <Crumbs breadcrumbsLinks={breadcrumbsLinks} />}

        <Paper className="min-h-full max-w-[700px] mx-auto mt-8 md:mt-16 lg:p-12 flex flex-col items-center">
          {children}
        </Paper>
      </FeatureFlagGuard>
    </div>
  )
}
