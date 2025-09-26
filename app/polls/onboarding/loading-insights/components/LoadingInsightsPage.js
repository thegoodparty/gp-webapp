'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingFooter from '../../components/LoadingFooter'
import LoadingList from '../../components/LoadingList'

export default function LoadingInsightsPage({ pathname }) {

  const router = useRouter()
  const [loadingItems, setLoadingItems] = useState([
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
  ])

  // Navigate to insights when all steps are complete
  const onComplete = () => {
    router.replace('/polls/onboarding')
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 flex flex-col bg-white md:bg-muted">
      <main className="flex-1 overflow-y-auto">
        <section className="max-w-screen-md mx-auto p-4 sm:p-8 lg:p-16 bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12 xs:mt-4">
          <div className="flex flex-col items-center md:justify-center sm:h-screen md:h-auto">
            <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
              Meet your constituents and see what issues matter to them.
            </h1>
            <p className="text-left md:text-center mt-2 text-lead w-full">
              Gathering key community insights...
            </p>
            <LoadingList items={loadingItems} onComplete={onComplete} />
          </div>
          <LoadingFooter />
        </section>
      </main>
      <div className="block md:hidden w-full pb-9">
        <LoadingFooter />
      </div>
    </div>
  )
}
