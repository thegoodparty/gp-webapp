'use client'
import Button from '@shared/buttons/Button'
import { FiPlus } from 'react-icons/fi'
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat'
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper'

export default function CreateNewChat() {
  const { setThreadId, setChat } = useChat()
  const handleCreate = () => {
    trackEvent(EVENTS.AIAssistant.ClickNewChat)
    setChat([])
    setThreadId(null)
  }

  return (
    <Button
      size="large"
      color="tertiary"
      onClick={handleCreate}
      className="!px-3 md:!px-6"
    >
      <span className="flex items-center">
        <FiPlus size={24} />
        <span className="ml-2 hidden md:block">New Chat</span>
      </span>
    </Button>
  )
}
