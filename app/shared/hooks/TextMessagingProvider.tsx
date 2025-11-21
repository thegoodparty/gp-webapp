'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

type TextMessagingContextValue = [
  textMessaging: Record<string, never>,
  refreshTextMessaging: () => Promise<void>
]

export const TextMessagingContext = createContext<TextMessagingContextValue>([{}, async () => {}])

interface TextMessagingProviderProps {
  children: React.ReactNode
  textMessaging: Record<string, never>
}

export const TextMessagingProvider = ({
  children,
  textMessaging: initialTextMessaging,
}: TextMessagingProviderProps): React.JSX.Element => {
  const [textMessaging, setTextMessaging] = useState<Record<string, never>>(initialTextMessaging)

  const refreshTextMessaging = async () => {
    try {
      const resp = await clientFetch(apiRoutes.textMessaging.list)
      setTextMessaging(
        resp?.status === 404 || resp.ok === false ? {} : (resp.data as Record<string, never>),
      )
    } catch (e) {
      console.error('error fetching text messaging', e)
      setTextMessaging({})
    }
  }

  return (
    <TextMessagingContext.Provider value={[textMessaging, refreshTextMessaging]}>
      {children}
    </TextMessagingContext.Provider>
  )
}

