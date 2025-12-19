import { createContext, useContext, useState, ReactNode } from 'react'

type OutreachType = 'text' | 'doorKnocking' | 'phoneBanking' | 'socialMedia' | 'robocall' | 'p2p'
type OutreachStatus = 'pending' | 'approved' | 'denied' | 'paid' | 'in_progress' | 'completed'

export interface Outreach {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
  campaignId: number
  outreachType: OutreachType
  projectId?: string | null
  name?: string | null
  status?: OutreachStatus | null
  error?: string | null
  audienceRequest?: string | null
  script?: string | null
  message?: string | null
  date?: Date | string | null
  imageUrl?: string | null
  voterFileFilterId?: number | null
  phoneListId?: number | null
  identityId?: string | null
  didState?: string | null
  title?: string | null
}

type OutreachContextValue = [
  Outreach[],
  (outreaches: Outreach[]) => void,
]

export const outreachContext = createContext<OutreachContextValue>([
  [],
  () => [],
])

interface OutreachProviderProps {
  initValue?: Outreach[]
  children: ReactNode
}

export const OutreachProvider = ({
  initValue = [],
  children,
}: OutreachProviderProps): React.JSX.Element => {
  const [outreaches, setOutreaches] = useState<Outreach[]>(initValue)

  return (
    <outreachContext.Provider value={[outreaches, setOutreaches]}>
      {children}
    </outreachContext.Provider>
  )
}

export const useOutreach = (): OutreachContextValue =>
  useContext(outreachContext)
