'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingFooter from '../../components/LoadingFooter'
import LoadingList from '../../components/LoadingList'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

interface LoadingItem {
  label: string
  status: 'loading' | 'pending' | 'complete'
}

const loadingItems: LoadingItem[] = [
  {
    label: 'Gathering your constituents',
    status: 'loading',
  },
  {
    label: 'Establishing community age groups',
    status: 'pending',
  },
  {
    label: 'Identifying homeowner vs. renter ratios',
    status: 'pending',
  },
  {
    label: 'Looking for families with children under 18',
    status: 'pending',
  },
  {
    label: 'Analyzing education levels',
    status: 'pending',
  },
  {
    label: 'Mapping income brackets',
    status: 'pending',
  },
  {
    label: 'Capturing community diversity',
    status: 'pending',
  },
  {
    label: 'Generating constituency profile',
    status: 'pending',
  },
]

export default function LoadingInsightsPage() {
  const router = useRouter()

  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.MeetYourConstituentsViewed)
  }, [])

  const onComplete = () => {
    router.replace('/polls/onboarding')
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 pb-24 md:pb-0">
        <section className="max-w-screen-md mx-auto p-4 sm:p-8 lg:p-16 bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12">
          <div className="flex flex-col items-center md:justify-center">
            <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
              Meet your constituents and see what issues matter to them.
            </h1>
            <p className="text-left md:text-center mt-2 text-lead w-full">
              Gathering key community insights...
            </p>
            <LoadingList items={loadingItems} onComplete={onComplete} />
          </div>
          <div className="hidden md:block w-full">
            <LoadingFooter />
          </div>
        </section>
      </main>
      <div className="block md:hidden w-full fixed bottom-0 inset-x-0 bg-white z-10 pb-10">
        <LoadingFooter />
      </div>
    </div>
  )
}
