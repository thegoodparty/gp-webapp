'use client'
import { useContext } from 'react'
import { TextMessagingContext } from './TextMessagingProvider'

export const useTextMessaging = () => useContext(TextMessagingContext)

