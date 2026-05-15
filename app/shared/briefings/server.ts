import { format, parseISO } from 'date-fns'
import { FetchError } from 'ofetch'
import { serverRequest } from 'gpApi/server-request'
import type {
  MeetingBriefingBudgetImpactDto,
  MeetingBriefingConstituentSentimentDto,
  MeetingBriefingItemDto,
  MeetingBriefingItemDisplayDto,
  MeetingBriefingRecentNewsEntryDto,
  MeetingBriefingResponseDto,
  MeetingBriefingSourceDto,
  MeetingBriefingTypeDto,
  MeetingsListItemDto,
} from 'gpApi/api-endpoints'
import type {
  Briefing,
  BriefingSummary,
  BudgetImpact,
  ConstituentSentiment,
  Item,
  ItemDisplay,
  RecentNewsEntry,
  Source,
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
})

export const getBriefingsList = async (): Promise<BriefingSummary[]> => {
  const { data } = await serverRequest('GET /v1/meetings', {})
  return data.meetings.map(toSummary)
}

const toSentiment = (
  dto: MeetingBriefingConstituentSentimentDto,
): ConstituentSentiment => ({
  summary: dto.summary,
  detail: dto.detail ?? null,
  districtNote: dto.district_note ?? null,
  haystaqColumn: dto.haystaq_column,
  meanScore: dto.mean_score,
  scoreDirection: dto.score_direction,
  voterCount: dto.voter_count,
  haystaqStatus: dto.haystaq_status,
  haystaqSource: dto.haystaq_source,
})

const toRecentNews = (
  dto: MeetingBriefingRecentNewsEntryDto,
): RecentNewsEntry => ({
  headline: dto.headline,
  publication: dto.publication,
  articleType: dto.article_type,
  publicationDate: dto.publication_date ?? null,
  url: dto.url,
})

const toBudgetImpact = (dto: MeetingBriefingBudgetImpactDto): BudgetImpact => ({
  summary: dto.summary,
  figures: dto.figures.map((f) => ({
    label: f.label,
    value: f.value,
    sourceId: f.source_id,
  })),
})

const toDisplay = (dto: MeetingBriefingItemDisplayDto): ItemDisplay => ({
  summary: dto.summary,
  constituentSentiment: dto.constituent_sentiment
    ? toSentiment(dto.constituent_sentiment)
    : null,
  recentNews: dto.recent_news ? dto.recent_news.map(toRecentNews) : null,
  budgetImpact: dto.budget_impact ? toBudgetImpact(dto.budget_impact) : null,
  talkingPoints: dto.talking_points ?? null,
  sourceIds: dto.source_ids ?? [],
})

const toItem = (dto: MeetingBriefingItemDto): Item => ({
  id: dto.id,
  itemNumber: dto.item_number,
  title: dto.title,
  tier: dto.tier,
  voteRequired: dto.vote_required,
  tierReason: dto.tier_reason,
  display: toDisplay(dto.display),
})

const toSource = (dto: MeetingBriefingSourceDto): Source => ({
  id: dto.id,
  name: dto.name,
  url: dto.url ?? null,
  sourceType: dto.source_type,
  publisher: dto.publisher ?? null,
  articleType: dto.article_type ?? null,
  publicationDate: dto.article_date ?? null,
  pageNumber: dto.page_number ?? null,
  sectionHeading: dto.section_heading ?? null,
  scoreValue: dto.score_value ?? null,
})

const BRIEFING_TYPE_LABEL: Record<MeetingBriefingTypeDto, string> = {
  city_council_meeting: 'City Council meeting',
  county_legislature_meeting: 'County Legislature meeting',
  school_board_meeting: 'School Board meeting',
}

const toBriefing = (
  dto: MeetingBriefingResponseDto,
  date: string,
): Briefing => {
  const formattedDate = format(parseISO(date), 'MMMM d, yyyy')
  return {
    experimentId: dto.experiment_id,
    briefingType: dto.briefing_type,
    briefingStatus: dto.briefing_status,
    generatedAt: dto.generated_at,
    officialName: dto.official_name,
    meetingDate: formattedDate,
    estimatedReadMinutes: dto.estimated_read_minutes,
    executiveSummary: dto.executive_summary,
    items: dto.items.map(toItem),
    sources: dto.sources.map(toSource),
    title: `${
      BRIEFING_TYPE_LABEL[dto.briefing_type]
    } briefing for ${formattedDate}`,
  }
}

export const getBriefingBySlug = async (
  slug: string,
): Promise<Briefing | null> => {
  try {
    const { data } = await serverRequest('GET /v1/meetings/:date/briefing', {
      date: slug,
    })
    return toBriefing(data, slug)
  } catch (e) {
    if (e instanceof FetchError && e.status === 404) return null
    throw e
  }
}
