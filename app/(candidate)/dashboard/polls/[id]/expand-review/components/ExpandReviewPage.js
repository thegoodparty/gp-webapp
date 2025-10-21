'use client'

import Crumbs from '../../../shared/Crumbs'
import { usePoll } from '../../../shared/hooks/PollProvider'
import PollsPageGuard from '../../../components/PollsPageGuard'
import Paper from '@shared/utils/Paper'
import { StepFooter } from '@shared/stepper'
import { useRouter } from 'next/navigation'
import H1 from '@shared/typography/H1'
import PreviewCard from 'app/polls/onboarding/components/steps/PreviewCard'
import { PRICE_PER_MESSAGE } from '../../../shared/constants'
import { numberFormatter } from 'helpers/numberHelper'
import { dateUsHelper } from 'helpers/dateHelper'
const recommended = 101

export default function PollIssueDetailPage({ count }) {
  const [poll] = usePoll()
  const router = useRouter()

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
    router.push(`/dashboard/polls/${poll.id}/expand-payment?count=${count} `)
  }
  const handleBack = () => {
    router.push(`/dashboard/polls/${poll.id}/expand`)
  }

  const { messageContent, imageUrl, estimatedCompletionDate } = poll
  const nextWeek = new Date().getTime() + 7 * 24 * 60 * 60 * 1000

  return (
    <div className="bg-indigo-100 min-h-screen p-4 md:p-8">
      <PollsPageGuard>
        <Crumbs breadcrumbsLinks={breadcrumbsLinks} />

        <Paper className="min-h-full max-w-[700px] mx-auto mt-8 md:mt-16 lg:p-12">
          <H1 className="text-center">Review your SMS poll.</H1>
          <PreviewCard
            demoMessageText={messageContent}
            imageUrl={imageUrl}
            estimatedCompletionDate={dateUsHelper(nextWeek, 'long')}
            count={count}
            timeline="1 week"
            cost={`$${numberFormatter(PRICE_PER_MESSAGE * count, 2)}`}
          />
          <div className="mt-8 pb-2 border-t border-slate-200" />
          <StepFooter
            numberOfSteps={3}
            currentStep={2}
            onBack={handleBack}
            onBackText="Back"
            disabledNext={false}
            onNext={handleNext}
            onNextText="Go to payment"
          />
        </Paper>
      </PollsPageGuard>
    </div>
  )
}
