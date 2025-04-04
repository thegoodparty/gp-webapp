'use client'
import { useContext } from 'react'
import { TextMessagingContext } from './TextMessagingProvider'

export const useTextMessaging = () => {
  const [textMessaging, refreshTextMessaging] =
    useContext(TextMessagingContext)

  return [textMessaging, refreshTextMessaging]
}
