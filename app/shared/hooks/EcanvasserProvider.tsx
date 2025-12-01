'use client'
import { createContext, useState, useEffect } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface Ecanvasser {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
  apiKey: string
  campaignId: number
  lastSync?: Date | string | null
  error?: string | null
}

type EcanvasserContextValue = [
  ecanvasser: Ecanvasser | null,
  setEcanvasser: (ecanvasser: Ecanvasser | null) => void
]

export const EcanvasserContext = createContext<EcanvasserContextValue>([null, () => {}])

interface EcanvasserProviderProps {
  children: React.ReactNode
}

export const EcanvasserProvider = ({ children }: EcanvasserProviderProps): React.JSX.Element => {
  const [ecanvasser, setEcanvasser] = useState<Ecanvasser | null>(null)

  useEffect(() => {
    const fetchEcanvasser = async () => {
      try {
        const ecanvasser = await clientFetch<Ecanvasser>(apiRoutes.ecanvasser.mine, undefined, {
          revalidate: 100,
        })
        setEcanvasser(ecanvasser?.status === 404 ? null : ecanvasser.data)
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

