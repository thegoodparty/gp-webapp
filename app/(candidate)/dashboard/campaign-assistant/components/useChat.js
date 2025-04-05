'use client'
import { useContext } from 'react'

import { ChatContext } from 'app/(candidate)/dashboard/campaign-assistant/components/ChatProvider'

const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatContextProvider')
  }
  return context
}

export default useChat
