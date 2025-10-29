'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { useSnackbar } from 'helpers/useSnackbar'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'
import { LuTrophy, LuMeh, LuFrown, LuArrowRight } from 'react-icons/lu'
import { useCampaign } from '@shared/hooks/useCampaign'

export default function LoadingInsightsPage({}) {
  const [campaign] = useCampaign()
  const { goals, details } = campaign || {}
  const electionDate = details?.electionDate || goals?.electionDate
  const officeName =
    details?.office?.toLowerCase() === 'other'
      ? details?.otherOffice
      : details?.office

  const router = useRouter()
  const { refreshElectedOffice } = useElectedOffice()
  const { errorSnackbar } = useSnackbar()
  const [result, setResult] = useState(null)
  const [requestState, setRequestState] = useState({
    loading: false,
    error: false,
  })

  const options = [
    { key: 'won', label: 'I won my race', icon: <LuTrophy size={24} /> },
    {
      key: 'lost',
      label: 'I lost my race',
      icon: <LuFrown size={24} />,
    },
    {
      key: 'neither',
      label: 'Neither, I am in a run-off election',
      icon: <LuMeh size={24} />,
    },
  ]

  const onSelectResult = (result) => {
    setResult(result)
  }

  const createElectedOffice = async () => {
    if (!electionDate) {
      throw new Error('Invalid election date')
    }

    const response = await clientFetch(apiRoutes.electedOffice.create, {
      electedDate: new Date(electionDate).toISOString().split('T')[0],
    })

    if (!response.ok) {
      throw new Error('Failed to create elected office')
    }
    refreshElectedOffice()
    return response.data
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setRequestState({ loading: true, error: false })
    try {
      const wonGeneral = result === 'won'

      await updateCampaign([{ key: 'details.wonGeneral', value: wonGeneral }])

      // Create ElectedOffice if the user won the election
      if (wonGeneral) {
        try {
          await createElectedOffice()
        } catch (electedOfficeError) {
          console.error('Error creating elected office:', electedOfficeError)
          // Don't fail the entire submission if elected office creation fails
          // Just log the error and continue
        }
      }

      trackEvent(EVENTS.Candidacy.CampaignCompleted, {
        winner: wonGeneral,
        officeElectionDate: electionDate,
        primary: false,
      })

      setFormSubmitted(true)
      setRequestState({ loading: false, error: false })
    } catch (e) {
      console.error('Error submitting General Result:', e)
      errorSnackbar('Failed to submit election result.')
      setRequestState({ loading: false, error: true })
    }
  }

  useEffect(() => {
    // trackEvent(EVENTS.ServeOnboarding.MeetYourConstituentsViewed)
  }, [])

  // Navigate to insights when all steps are complete
  const onComplete = () => {
    router.replace('/polls/onboarding')
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 pb-24 md:pb-0">
        <section className="max-w-screen-md mx-auto p-4 sm:p-8 lg:p-16 bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12">
          <div className="flex flex-col items-center md:justify-center">
            <form
              onSubmit={handleSubmit}
              className="pt-4 md:pt-16 pb-8 max-w-[450px] mx-auto"
            >
              <h1
                id="election-results-heading"
                className="text-center font-semibold text-2xl md:text-4xl w-full"
              >
                Election Results:
                <br />
                {officeName}
              </h1>
              <p className="text-center mt-4 text-lg font-normal text-muted-foreground w-full">
                It looks like your general election date has passed. Please
                confirm the outcome of your election.
              </p>

              <div
                className="flex flex-col gap-4 mt-8"
                role="radiogroup"
                aria-labelledby="election-results-heading"
              >
                {options.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className="flex items-center gap-4 cursor-pointer p-6 rounded-xl border border-base hover:bg-gray-50 text-left w-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => setResult(option.key)}
                    aria-pressed={result === option.key}
                    aria-label={option.label}
                  >
                    <div className="flex items-center gap-5 pointer-events-none">
                      {option.icon}
                      <span className="font-bold text-foreground">
                        {option.label}
                      </span>
                    </div>
                    <LuArrowRight
                      className="ml-auto pointer-events-none"
                      size={20}
                    />
                  </button>
                ))}
              </div>
              {requestState.error ? (
                <p className="text-red text-center">
                  An error occured when saving your election result, please try
                  again later.
                </p>
              ) : null}
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
