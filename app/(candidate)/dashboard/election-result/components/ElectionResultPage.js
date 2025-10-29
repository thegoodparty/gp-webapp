'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { useSnackbar } from 'helpers/useSnackbar'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'
import { LuTrophy, LuFrown, LuArrowRight, LuLoaderCircle } from 'react-icons/lu'
import { useCampaign } from '@shared/hooks/useCampaign'

const options = [
  { key: 'won', label: 'I won my race', icon: <LuTrophy size={24} /> },
  {
    key: 'lost',
    label: 'I lost my race',
    icon: <LuFrown size={24} />,
  },
  // {
  //   key: 'runoff',
  //   label: 'Neither, I am in a run-off election',
  //   icon: <LuMeh size={24} />,
  // },
]

export default function ElectionResultPage({}) {
  const router = useRouter()
  const [campaign, setCampaign] = useCampaign()
  const [selectedOption, setSelectedOption] = useState(null)
  const { goals, details } = campaign || {}
  const electionDate = details?.electionDate || goals?.electionDate
  const officeName =
    details?.office?.toLowerCase() === 'other'
      ? details?.otherOffice
      : details?.office

  const { refreshElectedOffice } = useElectedOffice()
  const { errorSnackbar } = useSnackbar()
  const [requestState, setRequestState] = useState({
    submitting: false,
    error: false,
  })

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
  console.log('render')

  async function handleSelection(selection) {
    setSelectedOption(selection)
    setRequestState({ submitting: true, error: false })
    try {
      const wonGeneral = selection === 'won'

      await updateCampaign([{ key: 'details.wonGeneral', value: wonGeneral }])

      trackEvent(EVENTS.Candidacy.DidYouWinModalCompleted, {
        status: selection,
      })
      // Create ElectedOffice if the user won the election
      if (wonGeneral) {
        setCampaign((campaign) => ({
          ...campaign,
          details: {
            ...campaign.details,
            wonGeneral: wonGeneral,
          },
        }))
        await createElectedOffice()
        router.push('/polls/welcome')
      } else {
        router.push('/dashboard/election-result/loss')
      }
    } catch (e) {
      console.error('Error submitting General Result:', e)
      errorSnackbar('Failed to submit election result.')
      setRequestState({ submitting: false, error: true })
    }
  }

  useEffect(() => {
    trackEvent(EVENTS.Candidacy.DidYouWinModalViewed)
  }, [])

  const isLoading = !campaign

  return (
    <div className="flex flex-col">
      <main className="flex-1 pb-24 md:pb-0">
        <section className="max-w-screen-md mx-auto p-4 sm:p-8 lg:p-16 bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12">
          <div className="flex flex-col items-center md:justify-center">
            {isLoading ? (
              <div
                className="pt-4 md:pt-16 pb-8 max-w-[450px] mx-auto w-full animate-pulse"
                aria-hidden
              >
                <div className="h-8 md:h-10 bg-slate-200 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-slate-200 rounded w-5/6 mx-auto mt-6" />
                <div className="flex flex-col gap-4 mt-8 w-full">
                  <div className="h-[72px] rounded-xl border border-slate-200 bg-slate-100" />
                  <div className="h-[72px] rounded-xl border border-slate-200 bg-slate-100" />
                  <div className="h-[72px] rounded-xl border border-slate-200 bg-slate-100" />
                </div>
              </div>
            ) : (
              <div className="pt-4 md:pt-16 pb-8 max-w-[450px] mx-auto">
                <h1
                  id="election-results-heading"
                  className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full"
                >
                  Election Results:
                  <br />
                  {officeName}
                </h1>
                <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground w-full">
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
                      className={`flex items-center gap-4 cursor-pointer p-6 rounded-xl border border-base hover:bg-gray-50 text-left w-full transition-colors focus:border-gray-300 focus:outline-none ${
                        selectedOption === option.key
                          ? '!bg-gray-900 text-white'
                          : 'bg-white text-black'
                      }
                      `}
                      disabled={requestState.submitting}
                      onClick={() => handleSelection(option.key)}
                      aria-pressed={selectedOption === option.key}
                      aria-label={option.label}
                    >
                      <div className="flex items-center gap-5 pointer-events-none">
                        {option.icon}
                        <span className="font-bold">{option.label}</span>
                      </div>
                      {requestState.submitting &&
                      selectedOption === option.key ? (
                        <LuLoaderCircle
                          className="ml-auto animate-spin"
                          size={20}
                        />
                      ) : (
                        <LuArrowRight
                          className="ml-auto pointer-events-none"
                          size={20}
                        />
                      )}
                    </button>
                  ))}
                </div>
                {requestState.error ? (
                  <p className="text-red text-center mt-4">
                    An error occured when saving your election result, please
                    try again later.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
