import { createContext, useContext, useState, ReactNode } from 'react'

type Outreach = {
  [key: string]: string | number | boolean | object | null
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
