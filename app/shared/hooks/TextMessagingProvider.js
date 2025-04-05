'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const TextMessagingContext = createContext([{}, () => {}])

export function TextMessagingProvider({
  children,
  textMessaging: initialTextMessaging,
  compliance: initialCompliance,
}) {
  const [textMessaging, setTextMessaging] = useState(initialTextMessaging)
  const [compliance, setCompliance] = useState(initialCompliance)

  const refreshTextMessaging = async () => {
    try {
      const resp = await clientFetch(apiRoutes.textMessaging.list)

      setTextMessaging(
        resp?.status === 404 || resp.ok === false ? {} : resp.data,
      )
    } catch (e) {
      console.error('error fetching text messaging', e)
      setTextMessaging({})
    }
  }

  return (
    <TextMessagingContext.Provider
      value={[textMessaging, refreshTextMessaging, compliance, setCompliance]}
    >
      {children}
    </TextMessagingContext.Provider>
  )
}
