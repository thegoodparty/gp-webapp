'use client'
import TextField from '@shared/inputs/TextField'
import { SendIcon, SquareIcon, ChevronUpIcon, IconButton } from '@styleguide'
import { FormEvent, KeyboardEvent, useState } from 'react'
import useChat from 'app/dashboard/campaign-assistant/components/useChat'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

const ChatInput = (): React.JSX.Element => {
  const { handleNewInput, loading, stopStream, scrollUp } = useChat()
  const [text, setText] = useState('')

  const canSend = !loading && text.trim().length > 0

  const submit = async () => {
    if (!canSend) return
    const value = text
    trackEvent(EVENTS.AIAssistant.AskQuestion, { text: value })
    setText('')
    await handleNewInput(value)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void submit()
  }

  // Enter sends; Shift+Enter inserts a newline (multiline composing).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <div className="w-full max-w-[960px] px-4 pb-6 self-center relative">
      <div className="absolute bottom-[10px] pb-6 left-6 min-[1400px]:left-[-40px]">
        <IconButton
          onClick={scrollUp}
          size="small"
          variant="default"
          aria-label="Scroll to top"
        >
          <ChevronUpIcon className="text-primary" />
        </IconButton>
      </div>
      <form noValidate onSubmit={onSubmit}>
        <TextField
          placeholder="Ask me anything about your campaign..."
          fullWidth
          multiline
          maxRows={6}
          autoFocus
          className="bg-white pl-6 min-[1400px]:pl-0 rounded-3xl border-transparent"
          value={text}
          onKeyDown={onKeyDown}
          onChange={(e) => {
            setText(e.target.value)
          }}
          InputProps={{
            endAdornment: loading ? (
              <IconButton
                type="button"
                onClick={stopStream}
                aria-label="Stop generating"
                size="small"
                variant="ghost"
              >
                <SquareIcon className="size-5" />
              </IconButton>
            ) : (
              <IconButton
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                size="small"
                variant="ghost"
              >
                <SendIcon
                  className={`size-5 ${
                    canSend ? 'text-primary' : 'text-gray-400'
                  }`}
                />
              </IconButton>
            ),
          }}
          inputProps={{
            'aria-label': 'Message',
          }}
        />
      </form>
    </div>
  )
}

export default ChatInput
