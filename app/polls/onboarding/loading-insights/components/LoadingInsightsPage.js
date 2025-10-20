'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingFooter from '../../components/LoadingFooter'
import LoadingList from '../../components/LoadingList'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useLoadingInsightsValidation } from '../../../hooks/useLoadingInsightsValidation'

export default function LoadingInsightsPage({}) {
  const validation = useLoadingInsightsValidation()

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

  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.MeetYourConstituentsViewed)
  }, [])

  // Navigate to insights when all steps are complete
  const onComplete = () => {
    router.replace('/polls/onboarding')
  }

  // Show error alert if validation fails
  if (validation.hasErrors && !validation.isLoading) {
    return (
      <div className="flex flex-col">
        <main className="flex-1 pb-24 md:pb-0">
          <section className="max-w-screen-md mx-auto p-4 sm:p-8 lg:p-16 bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12">
            <div className="flex flex-col items-center md:justify-center">
              <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full text-red-600">
                Unable to Load Insights
              </h1>
              <div className="mt-4 w-full">
                {validation.errors.map((error, index) => (
                  <div
                    key={index}
                    className="mb-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-800 font-medium">{error.message}</p>
                    {process.env.NODE_ENV === 'development' && (
                      <p className="text-red-600 text-sm mt-1">
                        Error: {error.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </section>
        </main>
      </div>
    )
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
            <LoadingList
              items={loadingItems}
              onComplete={onComplete}
              disabled={validation.hasErrors}
            />
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
