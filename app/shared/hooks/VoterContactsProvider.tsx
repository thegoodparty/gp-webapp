import { useCampaign } from '@shared/hooks/useCampaign'
import { createContext, useCallback, useEffect, useState } from 'react'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'

export const getVoterContactField = (outreachType: string): keyof VoterContactsState => {
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

type VoterContactsContextValue = [
  VoterContactsState,
  (
    next:
      | VoterContactsState
      | ((prev: VoterContactsState) => VoterContactsState),
  ) => Promise<void>,
]

export const VoterContactsContext = createContext<VoterContactsContextValue>([
  INITIAL_VOTER_CONTACTS_STATE,
  async () => {},
])

interface VoterContactsProviderProps {
  children: React.ReactNode
}

export const VoterContactsProvider = ({
  children,
}: VoterContactsProviderProps): React.JSX.Element => {
  const [campaign] = useCampaign()
  const { data: campaignData } = campaign || {}
  const { reportedVoterGoals } = campaignData || {}
  const [state, setState] = useState(INITIAL_VOTER_CONTACTS_STATE)

  useEffect(() => {
    if (reportedVoterGoals) {
      setState(getFilteredListOfReportedVoterContacts(reportedVoterGoals))
    }
  }, [reportedVoterGoals])

  const updateState = useCallback(
    async (
      next:
        | VoterContactsState
        | ((prev: VoterContactsState) => VoterContactsState),
    ) => {
      const newValues = typeof next === 'function' ? next(state) : next
      await updateCampaign([
        { key: 'data.reportedVoterGoals', value: newValues },
      ])

      setState(newValues)
    },
    [state],
  )

  return (
    <VoterContactsContext.Provider value={[state, updateState]}>
      {children}
    </VoterContactsContext.Provider>
  )
}
