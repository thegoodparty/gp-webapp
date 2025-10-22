'use client'

import Paper from '@shared/utils/Paper'
import Crumbs from '../../../shared/Crumbs'
import { usePoll } from '../../../shared/hooks/PollProvider'
import FeatureFlagGuard from '@shared/experiments/FeatureFlagGuard'

/**
 * Shared layout component for all expand poll flow pages
 * Provides consistent wrapper structure with background, guards, and paper container
 */
export default function ExpandPollLayout({ children, showBreadcrumbs = true }) {
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

        <Paper className="min-h-full max-w-[700px] mx-auto mt-8 md:mt-16 lg:p-12">
          {children}
        </Paper>
      </FeatureFlagGuard>
    </div>
  )
}
