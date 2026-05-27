import { format, parseISO } from 'date-fns'
import { FetchError } from 'ofetch'
import { serverRequest } from 'gpApi/server-request'
import type { MeetingsListItemDto } from 'gpApi/api-endpoints'
import type { MeetingBriefingFull } from 'gpApi/generated/agent-job-contracts'
import type {
  AwaitingBriefing,
  Briefing,
  BriefingSummary,
  BriefingType,
} from './types'
import { normalizeBriefingArtifact } from './normalizeArtifact'

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

export const getBriefingsList = async (): Promise<BriefingSummary[]> => {
  const { data } = await serverRequest('GET /v1/meetings', {})
  return data.meetings.map(toSummary)
}

const BRIEFING_TYPE_LABEL: Record<BriefingType, string> = {
  city_council_meeting: 'City Council meeting',
  county_legislature_meeting: 'County Legislature meeting',
  school_board_meeting: 'School Board meeting',
}

const isFullArtifact = (
  data: { briefing_status?: string } | { status?: string },
): data is MeetingBriefingFull => {
  const status = 'briefing_status' in data ? data.briefing_status : undefined
  return status === 'briefing_ready' || status === 'agenda_provided_by_user'
}

export const isFullBriefing = (b: Briefing | AwaitingBriefing): b is Briefing =>
  !('status' in b)

export const getBriefingBySlug = async (
  slug: string,
): Promise<Briefing | AwaitingBriefing | null> => {
  try {
    const { data } = await serverRequest('GET /v1/meetings/:date/briefing', {
      date: slug,
    })
    if ('status' in data && data.status === 'awaiting_agenda') {
      return {
        status: 'awaiting_agenda',
        slug,
        meetingName: data.meetingName,
        meetingDate: format(parseISO(slug), 'MMMM d, yyyy'),
        meetingTime: data.meetingTime,
        meetingTimezone: data.meetingTimezone,
        location: data.location,
        durationMinutes: data.durationMinutes,
      }
    }
    if (!isFullArtifact(data)) return null
    const normalized = normalizeBriefingArtifact(data)
    const formattedDate = format(parseISO(slug), 'MMMM d, yyyy')
    return {
      ...normalized,
      title: `${
        BRIEFING_TYPE_LABEL[normalized.briefing_type] ?? 'Meeting'
      } briefing for ${formattedDate}`,
    }
  } catch (e) {
    if (e instanceof FetchError && e.status === 404) return null
    throw e
  }
}
