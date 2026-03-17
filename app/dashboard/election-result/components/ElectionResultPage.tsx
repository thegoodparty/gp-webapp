'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import { useSnackbar } from 'helpers/useSnackbar'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { LuTrophy, LuFrown } from 'react-icons/lu'
import { useCampaign } from '@shared/hooks/useCampaign'
import ResultOptionButton from './ResultOptionButton'
import { clientRequest } from 'gpApi/typed-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ORGANIZATIONS_QUERY_KEY } from '@shared/organization-picker'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'

const RESULT_WON = 'won'
const RESULT_LOST = 'lost'

interface ResultOption {
  key: string
  label: string
  icon: React.ReactNode
}

const options: ResultOption[] = [
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

interface RequestState {
  submitting: boolean
  error: boolean
}

export default function ElectionResultPage(): React.JSX.Element {
  const router = useRouter()
  const [campaign, setCampaign] = useCampaign()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const { on: winServeSplit } = useFlagOn('win-serve-split')
  const details = campaign?.details
  const goals = campaign && 'goals' in campaign ? campaign.goals : undefined
  const goalsObj = goals && typeof goals === 'object' ? goals : null
  const goalsElectionDate =
    goalsObj &&
    'electionDate' in goalsObj &&
    typeof goalsObj.electionDate === 'string'
      ? goalsObj.electionDate
      : undefined
  const electionDate = details?.electionDate || goalsElectionDate
  const officeName =
    details?.office?.toLowerCase() === 'other'
      ? details?.otherOffice
      : details?.office

  const { errorSnackbar } = useSnackbar()
  const [requestState, setRequestState] = useState<RequestState>({
    submitting: false,
    error: false,
  })

  const queryClient = useQueryClient()

  const createElectedOfficeMutation = useMutation({
    mutationFn: async (electedDate: string) =>
      clientRequest('POST /v1/elected-office', { electedDate }).then(
        (res) => res.data,
      ),
    onSuccess: async (newOffice) => {
      if (winServeSplit) {
        const organizations = await clientRequest(
          'GET /v1/organizations',
          {},
        ).then((res) => res.data.organizations)

        queryClient.setQueryData(ORGANIZATIONS_QUERY_KEY, organizations)

        const newOrg = organizations.find(
          (org) => org.electedOfficeId === newOffice.id,
        )

        if (!newOrg) {
          throw new Error('New organization not found')
        }

        // TODO: coming in subsequent PR
        // setSelectedSlug(newOrg.slug)
      }

      router.replace('/polls/welcome')
    },
  })

  async function handleSelection(selection: string) {
    setSelectedOption(selection)
    setRequestState({ submitting: true, error: false })
    try {
      const wonGeneral = selection === RESULT_WON

      await updateCampaign([{ key: 'details.wonGeneral', value: wonGeneral }])

      if (campaign) {
        setCampaign({
          ...campaign,
          details: {
            ...campaign.details,
            wonGeneral: wonGeneral,
          },
        })
      }

      trackEvent(EVENTS.Candidacy.DidYouWinModalCompleted, {
        status: selection,
      })
      // Create ElectedOffice if the user won the election
      if (wonGeneral) {
        if (!electionDate) {
          throw new Error('Invalid election date')
        }
        const electedDate = new Date(electionDate).toISOString().split('T')[0]
        if (!electedDate) {
          throw new Error('Invalid elected date')
        }
        void createElectedOfficeMutation.mutate(electedDate)
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
              <div className="pt-4 pb-4 max-w-[450px] mx-auto">
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
