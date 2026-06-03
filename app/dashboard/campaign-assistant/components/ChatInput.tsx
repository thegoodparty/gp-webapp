'use client'
import TextField from '@shared/inputs/TextField'
import { MdSend, MdStop, MdKeyboardArrowUp } from 'react-icons/md'
import { FormEvent, KeyboardEvent, useState } from 'react'
import useChat from 'app/dashboard/campaign-assistant/components/useChat'
import { Fab, IconButton } from '@mui/material'
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
        <Fab
          onClick={scrollUp}
          size="small"
          color="primary"
          aria-label="Scroll to top"
        >
          <MdKeyboardArrowUp className="text-primary" />
        </Fab>
      </div>
      <form noValidate onSubmit={onSubmit}>
        <TextField
          placeholder="Ask me anything about your campaign..."
          fullWidth
          multiline
          maxRows={6}
          autoFocus
          className="bg-white pl-6 min-[1400px]:pl-0"
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
              >
                <MdStop size={22} />
              </IconButton>
            ) : (
              <IconButton
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                size="small"
              >
                <MdSend
                  size={20}
                  className={canSend ? 'text-primary' : 'text-gray-400'}
                />
              </IconButton>
            ),
            style: {
              outline: 'none',
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '24px',
              paddingLeft: '16px',
              paddingRight: '8px',
              borderColor: 'transparent',
              '& fieldset': {
                borderColor: 'transparent',
                border: 'none',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused': {
                outline: 'none',
              },
            },
          }}
          inputProps={{
            'aria-label': 'Message',
            style: {
              outline: 'none',
            },
          }}
        />
      </form>
    </div>
  )
}

export default ChatInput
