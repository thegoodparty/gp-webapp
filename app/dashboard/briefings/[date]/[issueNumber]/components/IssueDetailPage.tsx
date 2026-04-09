'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuDownload, LuChevronDown, LuChevronUp } from 'react-icons/lu'
import DashboardLayout from '../../../../shared/DashboardLayout'
import { Briefing } from '../../../shared/briefing-types'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

// Must stay in sync with PriorityIssueCard color palette
// Uses /900 for badge/text/border (dark), /50 for callout bg (tint).
const ISSUE_COLORS = [
  {
    badge: 'bg-brand-midnight-900',
    text: 'text-brand-midnight-900',
    border: 'border-l-brand-midnight-900',
    bg: 'bg-brand-midnight-50',
  },
  {
    badge: 'bg-brand-halo-green-900',
    text: 'text-brand-halo-green-900',
    border: 'border-l-brand-halo-green-900',
    bg: 'bg-brand-halo-green-50',
  },
  {
    badge: 'bg-brand-waxflower-900',
    text: 'text-brand-waxflower-900',
    border: 'border-l-brand-waxflower-900',
    bg: 'bg-brand-waxflower-50',
  },
] as const

interface IssueDetailPageProps {
  briefing: Briefing
  issueNumber: number
}

export default function IssueDetailPage({
  briefing,
  issueNumber,
}: IssueDetailPageProps) {
  const router = useRouter()
  const { meeting, priorityIssues } = briefing

  const issueIndex = priorityIssues.findIndex((i) => i.number === issueNumber)
  const issue = priorityIssues[issueIndex]
  if (!issue) return null

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const color = ISSUE_COLORS[issueIndex % ISSUE_COLORS.length]!
  // TODO: rename card → guidance, detail → analysis after pipeline field rename
  const { card: guidance, detail: analysis } = issue

  const formattedDate = new Date(meeting.date + 'T00:00:00').toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  )

  return (
    <DashboardLayout
      pathname="/dashboard/briefings"
      showAlert={false}
      wrapperClassName="!p-0"
    >
      <div className="flex flex-col min-h-full">
        {/* Sticky header — same as briefing detail */}
        <div className="sticky top-0 z-10 flex w-full flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-8 border-b border-border bg-background px-6 py-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="text-lg font-semibold text-foreground">
              {meeting.cityName} City Council Meeting Briefing
            </h1>
            <p className="text-lg font-normal text-muted-foreground">
              {formattedDate}
              {meeting.readTime ? ` · ${meeting.readTime}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                trackEvent(EVENTS.Briefings.ClickDownload, {
                  citySlug: meeting.citySlug,
                  date: meeting.date,
                  issueNumber,
                  context: 'issue_detail',
                })
              }
              className="inline-flex items-center justify-center gap-2 border bg-background hover:bg-accent hover:text-accent-foreground h-10 w-full sm:w-auto rounded-full border-foreground px-8 text-sm font-semibold transition-colors"
            >
              Download
              <span className="ml-2 order-1">
                <LuDownload className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>

        {/* Gray content area */}
        <div className="flex-1 w-full bg-muted px-4 py-8 sm:px-8 md:px-16 lg:px-32">
          <div
            className="mx-auto flex flex-col"
            style={{ width: 680, maxWidth: '100%' }}
          >
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-6 pt-6 pb-2">
                {/* Back link */}
                <button
                  onClick={() =>
                    router.push(`/dashboard/briefings/${meeting.date}`)
                  }
                  className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-colors"
                >
                  ← Back to briefing
                </button>

                {/* Issue number badge + label */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`flex items-center justify-center rounded-sm text-[10px] font-bold text-white ${color.badge}`}
                    style={{ width: 16, height: 16 }}
                  >
                    {issue.number}
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${color.text}`}
                  >
                    Priority Issue {issue.number} of {priorityIssues.length}
                  </span>
                </div>

                {/* Issue title */}
                <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                  {issue.agendaItemTitle}
                </h2>
              </div>

              <div className="px-6 pb-8 flex flex-col gap-5">
                {analysis ? (
                  <>
                    <Section
                      label="What is happening"
                      value={analysis.whatIsHappening}
                      colorClass={color.text}
                    />
                    <Section
                      label="What decision are you being asked to make"
                      value={analysis.whatDecision}
                      colorClass={color.text}
                    />
                    <Section
                      label="Why it matters"
                      value={analysis.whyItMatters}
                      colorClass={color.text}
                    />

                    {/* Recommendation */}
                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide mb-2 ${color.text}`}
                      >
                        What we think you should do
                      </p>
                      <p className="text-sm font-semibold text-card-foreground">
                        {analysis.recommendation}
                      </p>
                    </div>

                    {analysis.actionItem && (
                      <Section
                        label="Action item"
                        value={analysis.actionItem}
                        colorClass={color.text}
                      />
                    )}

                    {/* Say this in the room */}
                    <div
                      className={`px-6 py-4 border-l-4 ${color.border} ${color.bg}`}
                    >
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide mb-2 ${color.text}`}
                      >
                        Say this in the room
                      </p>
                      <p className="text-sm italic text-card-foreground leading-relaxed">
                        &ldquo;{analysis.askThis || guidance.askThisInTheRoom}
                        &rdquo;
                      </p>
                    </div>

                    {/* Collapsible sections */}
                    {analysis.whoIsPresenting && (
                      <Collapsible
                        label="Who is presenting and what to expect"
                        colorClass={color.text}
                      >
                        <p className="text-sm text-card-foreground">
                          {analysis.whoIsPresenting}
                        </p>
                      </Collapsible>
                    )}

                    {(analysis.supportingContext ||
                      (analysis.supportingDocuments &&
                        analysis.supportingDocuments.length > 0)) && (
                      <Collapsible
                        label="Supporting context"
                        colorClass={color.text}
                      >
                        {analysis.supportingContext && (
                          <p className="text-sm text-card-foreground">
                            {analysis.supportingContext}
                          </p>
                        )}
                        {analysis.supportingDocuments &&
                          analysis.supportingDocuments.length > 0 && (
                            <ul className="mt-3 flex flex-col gap-1">
                              {analysis.supportingDocuments.map((doc, i) => (
                                <li key={i}>
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline"
                                  >
                                    {doc.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                      </Collapsible>
                    )}
                  </>
                ) : (
                  /* Fallback to guidance card fields */
                  <>
                    <Section
                      label="What you need to do"
                      value={guidance.whatYouNeedToDo}
                      colorClass={color.text}
                    />
                    <div
                      className={`px-6 py-4 border-l-4 ${color.border} ${color.bg}`}
                    >
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide mb-2 ${color.text}`}
                      >
                        Say this in the room
                      </p>
                      <p className="text-sm italic text-card-foreground leading-relaxed">
                        &ldquo;{guidance.askThisInTheRoom}&rdquo;
                      </p>
                    </div>
                    {guidance.tryThis && (
                      <Section
                        label="Try this"
                        value={guidance.tryThis}
                        colorClass={color.text}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            <p className="mt-8 text-xs text-center text-muted-foreground/50">
              {briefing.footer.preparedBy} &middot;{' '}
              {briefing.footer.contactNote}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function Section({
  label,
  value,
  colorClass,
}: {
  label: string
  value: string
  colorClass: string
}) {
  return (
    <div>
      <p
        className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${colorClass}`}
      >
        {label}
      </p>
      <p className="text-sm text-card-foreground leading-relaxed">{value}</p>
    </div>
  )
}

function Collapsible({
  label,
  colorClass,
  children,
}: {
  label: string
  colorClass: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-5 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${colorClass}`}
        >
          {label}
        </p>
        {open ? (
          <LuChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <LuChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="border-t border-border px-5 py-4">{children}</div>
      )}
    </div>
  )
}
