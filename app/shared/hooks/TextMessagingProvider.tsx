'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface TextMessagingData {
}

type TextMessagingContextValue = [
  textMessaging: TextMessagingData,
  refreshTextMessaging: () => Promise<void>
]

export const TextMessagingContext = createContext<TextMessagingContextValue>([{}, async () => {}])

interface TextMessagingProviderProps {
  children: React.ReactNode
  textMessaging: TextMessagingData
}

export const TextMessagingProvider = ({
  children,
  textMessaging: initialTextMessaging,
}: TextMessagingProviderProps): React.JSX.Element => {
  const [textMessaging, setTextMessaging] = useState<TextMessagingData>(initialTextMessaging)

  const refreshTextMessaging = async () => {
    try {
      const resp = await clientFetch<TextMessagingData>(apiRoutes.textMessaging.list)
      setTextMessaging(
        resp?.status === 404 || resp.ok === false ? {} : resp.data,
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

