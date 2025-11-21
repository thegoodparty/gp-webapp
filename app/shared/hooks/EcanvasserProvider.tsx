'use client'
import { createContext, useState, useEffect } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

type EcanvasserContextValue = [
  ecanvasser: never | null,
  setEcanvasser: (ecanvasser: never | null) => void
]

export const EcanvasserContext = createContext<EcanvasserContextValue>([null, () => {}])

interface EcanvasserProviderProps {
  children: React.ReactNode
}

export const EcanvasserProvider = ({ children }: EcanvasserProviderProps): React.JSX.Element => {
  const [ecanvasser, setEcanvasser] = useState<never | null>(null)

  useEffect(() => {
    const fetchEcanvasser = async () => {
      try {
        const ecanvasser = await clientFetch(apiRoutes.ecanvasser.mine, undefined, {
          revalidate: 100,
        })
        setEcanvasser(ecanvasser?.status === 404 ? null : (ecanvasser as never))
      } catch (e) {
        console.log('error fetching ecanvasser', e)
        setEcanvasser(null)
      }
    }
    fetchEcanvasser()
  }, [])

  return (
    <EcanvasserContext.Provider value={[ecanvasser, setEcanvasser]}>
      {children}
    </EcanvasserContext.Provider>
  )
}

