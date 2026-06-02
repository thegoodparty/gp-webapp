'use client'
import Body2 from '@shared/typography/Body2'
import { MdErrorOutline, MdOutlineRefresh } from 'react-icons/md'
import useChat from 'app/dashboard/campaign-assistant/components/useChat'

const ChatError = (): React.JSX.Element => {
  const { error, retryLast, dismissError } = useChat()

  if (!error) {
    return <></>
  }

  return (
    <div className="ml-6 mb-12 flex items-center rounded-lg bg-red-50 px-4 py-3 text-red-700">
      <MdErrorOutline size={20} className="mr-2 shrink-0" />
      <Body2 className="flex-grow">{error.message}</Body2>
      {error.retryable ? (
        <button
          type="button"
          onClick={() => void retryLast()}
          className="ml-4 flex items-center font-medium text-red-700 hover:underline"
        >
          <MdOutlineRefresh size={18} className="mr-1" />
          Retry
        </button>
      ) : (
        <button
          type="button"
          onClick={dismissError}
          className="ml-4 font-medium text-red-700 hover:underline"
        >
          Dismiss
        </button>
      )}
    </div>
  )
}

export default ChatError
