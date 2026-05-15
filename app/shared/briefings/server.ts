import { cache } from 'react'
import { format, parseISO } from 'date-fns'
import { serverRequest } from 'gpApi/server-request'
import type {
  MeetingsListItemDto,
  MeetingBriefingResponseDto,
} from 'gpApi/api-endpoints'
import type { Briefing, BriefingSummary } from './types'

const getOffsetForZone = (instant: Date, timeZone: string): string => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  }).formatToParts(instant)
  const tzName =
    parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+00:00'
  const offset = tzName.replace('GMT', '')
  return offset === '' ? '+00:00' : offset
}

const buildScheduledAt = (item: MeetingsListItemDto): string => {
  const probe = new Date(`${item.meetingDate}T${item.meetingTime}:00Z`)
  const offset = getOffsetForZone(probe, item.meetingTimezone)
  return `${item.meetingDate}T${item.meetingTime}:00${offset}`
}

const toSummary = (item: MeetingsListItemDto): BriefingSummary => ({
  id: item.meetingDate,
  slug: item.meetingDate,
  meetingDate: format(parseISO(item.meetingDate), 'MMMM d, yyyy'),
  meetingName: item.meetingName,
  scheduledAt: buildScheduledAt(item),
  location: item.location,
  status: item.hasBriefing ? 'briefing_ready' : 'awaiting_agenda',
})

export const getBriefingsList = cache(async (): Promise<BriefingSummary[]> => {
  const { data } = await serverRequest('GET /v1/meetings', {})
  if (!data.scheduleKnown) return []
  return data.meetings.map(toSummary)
})

const toBriefing = (dto: MeetingBriefingResponseDto): Briefing => ({
  ...dto,
  meetingDate: format(parseISO(dto.meetingDate), 'MMMM d, yyyy'),
  actionItems: dto.actionItems.map((item) => ({
    ...item,
    budgetImpact: item.budgetImpact
      ? {
          summary: item.budgetImpact.summary,
          sources: item.budgetImpact.sources,
        }
      : null,
  })),
})

export const getBriefingBySlug = cache(
  async (slug: string): Promise<Briefing | null> => {
    try {
      const { data } = await serverRequest('GET /v1/meetings/:date/briefing', {
        date: slug,
      })
      return toBriefing(data)
    } catch {
      return null
    }
  },
)
