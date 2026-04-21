import { noop, noopAsync } from '@shared/utils/noop'
import { useCampaign } from '@shared/hooks/useCampaign'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { createContext, useCallback, useMemo } from 'react'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Campaign } from 'helpers/types'

export const getVoterContactField = (
  outreachType: string,
): keyof VoterContactsState => {
  switch (outreachType) {
    case 'text':
    case 'p2p':
      return 'text'
    case 'doorKnocking':
      return 'doorKnocking'
    case 'phoneBanking':
      return 'phoneBanking'
    case 'socialMedia':
      return 'socialMedia'
    case 'robocall':
      return 'robocall'
    case 'events':
      return 'events'
    default:
      return 'text'
  }
}

interface ReportedVoterGoals {
  doorKnocking?: number
  calls?: number
  digital?: number
  directMail?: number
  digitalAds?: number
  text?: number
  events?: number
  yardSigns?: number
  robocall?: number
  phoneBanking?: number
  socialMedia?: number
}

export interface VoterContactsState {
  doorKnocking: number
  calls: number
  digital: number
  directMail: number
  digitalAds: number
  text: number
  events: number
  yardSigns: number
  robocall: number
  phoneBanking: number
  socialMedia: number
}

export const getFilteredListOfReportedVoterContacts = (
  reportedVoterGoals?: ReportedVoterGoals,
): VoterContactsState => ({
  doorKnocking: reportedVoterGoals?.doorKnocking || 0,
  calls: reportedVoterGoals?.calls || 0,
  digital: reportedVoterGoals?.digital || 0,
  directMail: reportedVoterGoals?.directMail || 0,
  digitalAds: reportedVoterGoals?.digitalAds || 0,
  text: reportedVoterGoals?.text || 0,
  events: reportedVoterGoals?.events || 0,
  yardSigns: reportedVoterGoals?.yardSigns || 0,
  robocall: reportedVoterGoals?.robocall || 0,
  phoneBanking: reportedVoterGoals?.phoneBanking || 0,
  socialMedia: reportedVoterGoals?.socialMedia || 0,
})

const INITIAL_VOTER_CONTACTS_STATE: VoterContactsState = {
  doorKnocking: 0,
  calls: 0,
  digital: 0,
  directMail: 0,
  digitalAds: 0,
  text: 0,
  events: 0,
  yardSigns: 0,
  robocall: 0,
  phoneBanking: 0,
  socialMedia: 0,
}

type VoterContactsUpdater = (
  next: VoterContactsState | ((prev: VoterContactsState) => VoterContactsState),
) => Promise<void>

type VoterContactsLocalUpdater = (
  next: VoterContactsState | ((prev: VoterContactsState) => VoterContactsState),
) => void

type VoterContactsContextValue = [
  VoterContactsState,
  VoterContactsUpdater,
  VoterContactsLocalUpdater,
]

export const VoterContactsContext = createContext<VoterContactsContextValue>([
  INITIAL_VOTER_CONTACTS_STATE,
  noopAsync,
  noop,
])

interface VoterContactsProviderProps {
  children: React.ReactNode
}

export const VoterContactsProvider = ({
  children,
}: VoterContactsProviderProps): React.JSX.Element => {
  const queryClient = useQueryClient()
  const [campaign] = useCampaign()
  const reportedVoterGoals = campaign?.data?.reportedVoterGoals

  const state = useMemo(
    () => getFilteredListOfReportedVoterContacts(reportedVoterGoals),
    [reportedVoterGoals],
  )

  const writeToCache = useCallback(
    (next: VoterContactsState) => {
      queryClient.setQueryData<Campaign | null>(CAMPAIGN_QUERY_KEY, (prev) =>
        prev
          ? {
              ...prev,
              data: { ...(prev.data ?? {}), reportedVoterGoals: next },
            }
          : prev,
      )
    },
    [queryClient],
  )

  const mutation = useMutation<
    VoterContactsState,
    Error,
    VoterContactsState,
    { previous: Campaign | null | undefined }
  >({
    mutationFn: async (newValues) => {
      await updateCampaign([
        { key: 'data.reportedVoterGoals', value: newValues },
      ])
      return newValues
    },
    onMutate: async (newValues) => {
      await queryClient.cancelQueries({ queryKey: CAMPAIGN_QUERY_KEY })
      const previous = queryClient.getQueryData<Campaign | null>(
        CAMPAIGN_QUERY_KEY,
      )
      writeToCache(newValues)
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(CAMPAIGN_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY_KEY })
    },
  })

  const updateState = useCallback<VoterContactsUpdater>(
    async (next) => {
      const newValues = typeof next === 'function' ? next(state) : next
      await mutation.mutateAsync(newValues)
    },
    [mutation, state],
  )

  const updateLocalState = useCallback<VoterContactsLocalUpdater>(
    (next) => {
      writeToCache(typeof next === 'function' ? next(state) : next)
    },
    [state, writeToCache],
  )

  return (
    <VoterContactsContext.Provider
      value={[state, updateState, updateLocalState]}
    >
      {children}
    </VoterContactsContext.Provider>
  )
}
