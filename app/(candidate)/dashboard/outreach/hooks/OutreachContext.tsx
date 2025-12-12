import { createContext, useContext, useState, ReactNode } from 'react'

// TODO: Investigate actual Outreach properties and define specific interface
// Grep for outreach property access patterns and replace Record<string, unknown>
type Outreach = Record<string, unknown>

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
