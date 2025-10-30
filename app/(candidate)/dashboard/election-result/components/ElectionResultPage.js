'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { useSnackbar } from 'helpers/useSnackbar'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'
import { LuTrophy, LuFrown } from 'react-icons/lu'
import { useCampaign } from '@shared/hooks/useCampaign'
import ResultOptionButton from './ResultOptionButton'

const RESULT_WON = 'won'
const RESULT_LOST = 'lost'

const options = [
  { key: RESULT_WON, label: 'I won my race', icon: <LuTrophy size={24} /> },
  {
    key: RESULT_LOST,
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

  async function handleSelection(selection) {
    setSelectedOption(selection)
    setRequestState({ submitting: true, error: false })
    try {
      const wonGeneral = selection === RESULT_WON

      await updateCampaign([{ key: 'details.wonGeneral', value: wonGeneral }])

      setCampaign((campaign) => ({
        ...campaign,
        details: {
          ...campaign.details,
          wonGeneral: wonGeneral,
        },
      }))

      trackEvent(EVENTS.Candidacy.DidYouWinModalCompleted, {
        status: selection,
      })
      // Create ElectedOffice if the user won the election
      if (wonGeneral) {
        await createElectedOffice()
        router.replace('/polls/welcome')
      } else {
        router.replace('/dashboard/election-result/loss')
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
                    <ResultOptionButton
                      key={option.key}
                      option={option}
                      selected={selectedOption === option.key}
                      submitting={requestState.submitting}
                      onSelect={handleSelection}
                    />
                  ))}
                </div>
                {requestState.error ? (
                  <p className="text-red text-center mt-4">
                    An error occurred when saving your election result, please
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
