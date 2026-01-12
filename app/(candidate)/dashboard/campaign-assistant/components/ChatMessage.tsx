'use client'
import Body2 from '@shared/typography/Body2'
import { marked } from 'marked'
import Typewriter from 'typewriter-effect'
import { CopyToClipboard } from 'react-copy-to-clipboard-ts'
import { FaRegCopy } from 'react-icons/fa'
import { useState } from 'react'
import Subtitle2 from '@shared/typography/Subtitle2'
import { IoMdCheckmark } from 'react-icons/io'
import { MdOutlineRefresh, MdAutoAwesome } from 'react-icons/md'
import ChatFeedback from './ChatFeedback'
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { ChatMessage as ChatMessageType } from './ajaxActions'

interface ChatMessageProps {
  message: ChatMessageType
  type: boolean
  isLastMessage: boolean
}

const ChatMessage = ({ message, type, isLastMessage }: ChatMessageProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false)
  const { handleRegenerate, finishTyping } = useChat()
  let { content, role } = message
  try {
    if (role === 'assistant') {
      content = marked(content) as string
    }
  } catch (e) {
    console.log('error converting marked', e)
  }
  const handleCopy = () => {
    trackEvent(EVENTS.AIAssistant.Chat.ClickCopy)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleRegenerateClick = () => {
    trackEvent(EVENTS.AIAssistant.Chat.ClickRegenerate)
    handleRegenerate()
  }

  return (
    <div className={`flex py-2 px-4 ${role === 'user' ? 'justify-end' : ''}`}>
      {role === 'assistant' ? (
        <div className="flex items-start">
          <MdAutoAwesome size={16} />
          <Body2 className="ml-2 prose [&>div>p:first-child]:mt-0">
            {type ? (
              <Typewriter
                options={{
                  delay: 1,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(content)
                    .callFunction(finishTyping)
                    .start()
                }}
              />
            ) : (
              <>
                <div dangerouslySetInnerHTML={{ __html: content }} />
                <div className="flex items-center border-b border-black/[0.12] w-[250px] pb-4 mb-2">
                  {isLastMessage && (
                    <>
                      <ChatFeedback />
                      <MdOutlineRefresh
                        className="mr-4 cursor-pointer"
                        size={20}
                        onClick={handleRegenerateClick}
                      />
                    </>
                  )}
                  <>
                    {copied ? (
                      <div className="px-2 py-1 bg-primary/[0.08] flex items-center rounded-full">
                        <IoMdCheckmark size={16} className="mr-2" />
                        <Subtitle2>Copied</Subtitle2>
                      </div>
                    ) : (
                      <div className="py-1">
                        <CopyToClipboard
                          text={content.replace(/<[^>]*>/g, '')}
                          onCopy={handleCopy}
                        >
                          <FaRegCopy className="cursor-pointer" size={16} />
                        </CopyToClipboard>
                      </div>
                    )}
                  </>
                </div>
              </>
            )}
          </Body2>
        </div>
      ) : (
        <div className=" bg-white py-2 px-4 rounded-lg">
          <Body2>{content}</Body2>
        </div>
      )}
    </div>
  )
}

export default ChatMessage
