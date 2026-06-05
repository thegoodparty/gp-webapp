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
  userAgendaStatus: item.userAgendaStatus ?? null,
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
  // Narrow on the status discriminator alone. `briefing_id` (the share
  // token used by the drawer) was originally also checked here, but doing
  // so makes the entire briefing page 404 during a rolling-deploy window
  // where gp-webapp has the share-drawer code but gp-api hasn't shipped
  // the `briefing_id` augmentation yet — a much worse failure mode than
  // a broken share button. The drawer code in `ShareScope` now suppresses
  // the share UI when `briefing_id` is absent so we degrade gracefully.
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
    const formattedDate = format(parseISO(slug), 'MMMM d, yyyy')
    // `briefing_id` is the augmentation that gp-api adds onto the artifact
    // payload alongside this PR. During a rolling-deploy window where the
    // server hasn't shipped that yet, the field will be undefined; default
    // to an empty string so the page still renders and let downstream
    // consumers (the share drawer) detect the empty value and hide
    // share-only UI. Once the contracts package catches up, this fallback
    // becomes dead code that should be removed alongside the augmentation
    // declaration in `types.ts`.
    const briefingId = (data as { briefing_id?: unknown }).briefing_id ?? ''
    return {
      ...data,
      briefing_id: typeof briefingId === 'string' ? briefingId : '',
      title: `${
        BRIEFING_TYPE_LABEL[data.briefing_type] ?? 'Meeting'
      } briefing for ${formattedDate}`,
    }
  } catch (e) {
    if (e instanceof FetchError && e.status === 404) return null
    throw e
  }
}
