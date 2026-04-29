'use client'
import { useEffect } from 'react'
import { LuDownload } from 'react-icons/lu'
import DashboardLayout from '../../../shared/DashboardLayout'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import PriorityIssueCard from './PriorityIssueCard'
import FullAgendaAccordion from './FullAgendaAccordion'
import { Briefing } from '../../shared/briefing-types'

interface BriefingDetailPageProps {
  briefing: Briefing
}

export default function BriefingDetailPage({
  briefing,
}: BriefingDetailPageProps) {
  const { meeting, priorityIssues, fullAgenda, fullAgendaSummary } = briefing

  useEffect(() => {
    trackEvent(EVENTS.Briefings.BriefingViewed, {
      citySlug: meeting.citySlug,
      date: meeting.date,
    })
  }, [meeting.citySlug, meeting.date])

  const meetingDate = new Date(meeting.date + 'T00:00:00')
  const weekday = meetingDate.toLocaleDateString('en-US', { weekday: 'long' })
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <DashboardLayout
      pathname="/dashboard/briefings"
      showAlert={false}
      wrapperClassName="!p-0"
    >
      <div className="flex flex-col min-h-full">
        {/* Sticky header */}
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
                  context: 'briefing_detail',
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
            {/* Single big card containing hero + all priority issues */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-4">
              {/* Hero heading */}
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-2xl font-semibold text-card-foreground">
                  Here&apos;s what&apos;s on the agenda and what you need to do
                  before {weekday}:
                </h2>
              </div>

              {/* Priority issues — separated by dividers */}
              {priorityIssues.map((issue, idx) => (
                <div key={issue.slug}>
                  <PriorityIssueCard
                    issue={issue}
                    totalCount={priorityIssues.length}
                    date={meeting.date}
                    weekday={weekday}
                    colorIndex={idx}
                  />
                </div>
              ))}
            </div>

            {/* Full agenda accordion */}
            {fullAgenda.length > 0 && (
              <FullAgendaAccordion
                items={fullAgenda}
                summary={fullAgendaSummary}
              />
            )}

            {/* Footer */}
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
