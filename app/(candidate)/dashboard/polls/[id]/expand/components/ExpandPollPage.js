'use client'

import Crumbs from '../../../shared/Crumbs'
import { usePoll } from '../../../shared/hooks/PollProvider'
import PollsPageGuard from '../../../components/PollsPageGuard'
import Paper from '@shared/utils/Paper'
import TitleSection from './TitleSection'
import SelectSection from './SelectSection'
import { StepFooter } from '@shared/stepper'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
const recommended = 101

export default function PollIssueDetailPage() {
  const [poll] = usePoll()
  const router = useRouter()
  const [count, setCount] = useState(recommended)

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

  const handleNext = () => {
    router.push(`/dashboard/polls/${poll.id}/expand/review?count=${count} `)
  }

  return (
    <div className="bg-indigo-100 min-h-screen p-4 md:p-8">
      <PollsPageGuard>
        <Crumbs breadcrumbsLinks={breadcrumbsLinks} />

        <Paper className="min-h-full max-w-[700px] mx-auto mt-8 md:mt-16">
          <TitleSection />
          <SelectSection countCallback={setCount} recommended={recommended} />
          <div className="mt-8 pb-2 border-t border-slate-200" />
          <StepFooter
            numberOfSteps={3}
            currentStep={1}
            onBack={null}
            onBackText="Back"
            disabledNext={false}
            onNext={handleNext}
            onNextText="Review"
          />
        </Paper>
      </PollsPageGuard>
    </div>
  )
}
