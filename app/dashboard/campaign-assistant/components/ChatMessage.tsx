'use client'
import Body2 from '@shared/typography/Body2'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DOMPurify from 'isomorphic-dompurify'
import { FaRegCopy } from 'react-icons/fa'
import { useRef, useState } from 'react'
import Subtitle2 from '@shared/typography/Subtitle2'
import { IoMdCheckmark } from 'react-icons/io'
import { MdOutlineRefresh, MdAutoAwesome } from 'react-icons/md'
import ChatFeedback from './ChatFeedback'
import useChat from 'app/dashboard/campaign-assistant/components/useChat'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { ChatMessage as ChatMessageType } from './ajaxActions'

// Element-targeted styling for rendered markdown. Mirrors the briefing
// assistant. The `!`/important display overrides are REQUIRED: the dashboard
// wraps this in a `[data-slot]` styleguide container, and `globals.css` sets
// `[data-slot] li { display: flex }` (plus other resets). Without forcing
// `display` back, list items become flex rows — which drops bullets/numbers
// and collapses the whitespace between inline children, gluing links to the
// surrounding text. The overrides beat those unlayered/base global rules.
const MARKDOWN_CLASS =
  'text-sm leading-relaxed space-y-2 [&>:first-child]:mt-0 [&>:last-child]:mb-0 ' +
  '[&_p]:!block [&_p]:!flex-none [&_p]:!whitespace-normal [&_p]:my-0 ' +
  '[&_strong]:!inline [&_strong]:font-semibold [&_em]:!inline [&_em]:italic ' +
  '[&_a]:!inline [&_a]:text-blue-700 [&_a]:underline ' +
  '[&_code]:!inline [&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs ' +
  '[&_pre]:rounded-lg [&_pre]:bg-black/5 [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre>code]:bg-transparent [&_pre>code]:p-0 ' +
  '[&_li]:!list-item [&_li]:my-0 ' +
  '[&_ul]:!block [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:!block [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 ' +
  '[&_h1]:!block [&_h1]:text-base [&_h1]:font-semibold [&_h2]:!block [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:!block [&_h3]:text-sm [&_h3]:font-semibold ' +
  '[&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600 ' +
  '[&_table]:!table [&_table]:!w-full [&_table]:!border-collapse [&_table]:my-2 ' +
  '[&_thead]:!table-header-group [&_tbody]:!table-row-group [&_tr]:!table-row ' +
  '[&_tr]:!border-b [&_tr]:border-gray-200 ' +
  '[&_th]:!table-cell [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold [&_th]:!border-b-2 [&_th]:!border-gray-300 ' +
  '[&_td]:!table-cell [&_td]:px-2 [&_td]:py-1.5 [&_td]:align-top'

// The campaign chat's CMS-managed system prompt currently instructs the model
// to emit HTML (`<ul>`, `<a href>`, etc.), while the briefings contract is
// Markdown. Detect which we got and render accordingly so the assistant looks
// right regardless of the prompt contract (and for legacy HTML-stored history).
const HTML_TAG_REGEX =
  /<\/?(?:ul|ol|li|p|a|strong|b|em|i|table|thead|tbody|tr|th|td|br|h[1-6]|div|span|blockquote|code|pre|hr)\b/i

const looksLikeHtml = (raw: string): boolean => HTML_TAG_REGEX.test(raw)

// Force a safe `rel` on any new-tab link in model-authored HTML to prevent
// reverse tab-nabbing (the Markdown path already hard-codes this on its `a`).
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

// Sanitize model-authored HTML before rendering. Keep link targets/rel so
// resource links still open in a new tab; DOMPurify strips scripts/handlers
// and the hook above guarantees `rel="noopener noreferrer"`.
const sanitizeHtml = (raw: string): string =>
  DOMPurify.sanitize(raw, { ADD_ATTR: ['target', 'rel'] })

// Hoisted so the renderer map isn't reallocated on every message render.
const MARKDOWN_COMPONENTS = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
}

interface ChatMessageProps {
  message: ChatMessageType
  isLastMessage: boolean
  isStreaming?: boolean
}

const ChatMessage = ({
  message,
  isLastMessage,
  isStreaming = false,
}: ChatMessageProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const { handleRegenerate } = useChat()
  const { content, role } = message

  const flashCopied = () => {
    trackEvent(EVENTS.AIAssistant.Chat.ClickCopy)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  // Copy the *rendered* message so pasting into Docs/email keeps formatting and
  // clickable links (rich `text/html`), with a plain-text fallback. Falls back
  // to writing the raw markdown if the Clipboard API is unavailable.
  const handleCopy = async () => {
    const node = contentRef.current
    const html = node?.innerHTML ?? ''
    const plain = node?.innerText ?? content
    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined' && html) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([plain], { type: 'text/plain' }),
          }),
        ])
      } else {
        await navigator.clipboard.writeText(plain)
      }
      flashCopied()
    } catch {
      try {
        await navigator.clipboard.writeText(content)
        flashCopied()
      } catch {
        // Clipboard unavailable (e.g. insecure context); nothing to do.
      }
    }
  }

  const handleRegenerateClick = () => {
    trackEvent(EVENTS.AIAssistant.Chat.ClickRegenerate)
    handleRegenerate()
  }

  return (
    <div className={`flex py-2 px-4 ${role === 'user' ? 'justify-end' : ''}`}>
      {role === 'assistant' ? (
        <div className="flex items-start max-w-full">
          <MdAutoAwesome size={16} className="mt-1 shrink-0" />
          <div className="ml-2 min-w-0 flex-1">
            <div ref={contentRef} className={MARKDOWN_CLASS}>
              {looksLikeHtml(content) ? (
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                />
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MARKDOWN_COMPONENTS}
                >
                  {content}
                </ReactMarkdown>
              )}
            </div>
            {!isStreaming && (
              <div className="flex items-center border-b border-black/[0.12] w-[250px] pb-4 mb-2 mt-2">
                {isLastMessage && (
                  <>
                    <ChatFeedback />
                    <button
                      type="button"
                      aria-label="Regenerate response"
                      className="mr-4 cursor-pointer"
                      onClick={handleRegenerateClick}
                    >
                      <MdOutlineRefresh size={20} />
                    </button>
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
                      <button
                        type="button"
                        aria-label="Copy message"
                        className="cursor-pointer"
                        onClick={() => void handleCopy()}
                      >
                        <FaRegCopy size={16} />
                      </button>
                    </div>
                  )}
                </>
              </div>
            )}
          </div>
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
