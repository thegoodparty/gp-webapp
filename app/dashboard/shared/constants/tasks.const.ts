import { format, subDays } from 'date-fns'

// NOTE: copied from CampaignTaskType enum in gp-api
export const TASK_TYPES = {
  text: 'text',
  p2pDisabledText: 'p2pDisabledText',
  robocall: 'robocall',
  doorKnocking: 'doorKnocking',
  phoneBanking: 'phoneBanking',
  socialMedia: 'socialMedia',
  events: 'events',
  education: 'education',
  compliance: 'compliance',
  awareness: 'awareness',
}

// Legacy types, these were based on voter file types
// TODO: remove these once we replace old dashboard view with new task flow
export const LEGACY_TASK_TYPES = {
  sms: 'sms',
  telemarketing: 'telemarketing',
}

export const STEPS = {
  intro: 'intro',
  budget: 'budget', // Not used right now
  audience: 'audience',
  script: 'script',
  image: 'image',
  schedule: 'schedule',
  complete: 'complete',
  download: 'download',
  socialPost: 'socialPost',
  purchase: 'purchase',
}

export const DISPLAY_TASK_TYPES: Record<
  (typeof TASK_TYPES)[keyof typeof TASK_TYPES],
  string
> = {
  text: 'Texting',
  p2pDisabledText: 'Texting',
  robocall: 'Robocall',
  doorKnocking: 'Door Knocking',
  phoneBanking: 'Phone Banking',
  socialMedia: 'Social Media',
  events: 'Event',
  education: 'Education',
  compliance: 'Compliance',
  awareness: 'Awareness',
}

export const WEEK_POSITIONS = {
  past: 'past',
  current: 'current',
  future: 'future',
} as const

export type WeekPosition = (typeof WEEK_POSITIONS)[keyof typeof WEEK_POSITIONS]

export const NAV_DIRECTIONS = {
  previous: 'previous',
  next: 'next',
} as const

export type NavDirection = (typeof NAV_DIRECTIONS)[keyof typeof NAV_DIRECTIONS]

export const STATUS_CHANGES = {
  complete: 'complete',
  incomplete: 'incomplete',
} as const

export type StatusChange = (typeof STATUS_CHANGES)[keyof typeof STATUS_CHANGES]

export const TRACKING_SOURCES = {
  manualCheckoff: 'manualCheckoff',
  schedulingFlow: 'schedulingFlow',
} as const

export type TrackingSource =
  (typeof TRACKING_SOURCES)[keyof typeof TRACKING_SOURCES]

export type CampaignPlanEventTaskType = 'text' | 'robocall' | 'event'

export const getCampaignPlanEventTaskType = (
  taskType: string,
): CampaignPlanEventTaskType | null => {
  switch (taskType) {
    case TASK_TYPES.text:
    case TASK_TYPES.p2pDisabledText:
      return 'text'
    case TASK_TYPES.robocall:
      return 'robocall'
    case TASK_TYPES.events:
      return 'event'
    default:
      return null
  }
}

export function formatTaskDate(
  taskDate: string | null | undefined,
  electionDate: string | undefined,
  deadline: number | undefined,
): string {
  if (taskDate) {
    return format(new Date(taskDate.slice(0, 10).replace(/-/g, '/')), 'MMM d')
  }
  if (electionDate && deadline) {
    return format(
      subDays(new Date(electionDate.replace(/-/g, '/')), deadline),
      'MMM d',
    )
  }
  return ''
}

type TaskTypeKey = keyof typeof TASK_TYPES
type LegacyTaskTypeKey = keyof typeof LEGACY_TASK_TYPES

type StepsByTypeMap = {
  [K in
    | (typeof TASK_TYPES)[TaskTypeKey]
    | (typeof LEGACY_TASK_TYPES)[LegacyTaskTypeKey]]?: string[]
}

export const STEPS_BY_TYPE: StepsByTypeMap = {
  [TASK_TYPES.text]: [
    STEPS.intro,
    STEPS.audience,
    STEPS.script,
    STEPS.image,
    STEPS.schedule,
    STEPS.purchase,
  ],
  [TASK_TYPES.robocall]: [
    STEPS.intro,
    STEPS.audience,
    STEPS.script,
    STEPS.schedule,
  ],
  [TASK_TYPES.doorKnocking]: [
    STEPS.intro,
    STEPS.audience,
    STEPS.script,
    STEPS.download,
  ],
  [TASK_TYPES.phoneBanking]: [
    STEPS.intro,
    STEPS.audience,
    STEPS.script,
    STEPS.download,
  ],
  [TASK_TYPES.socialMedia]: [STEPS.intro, STEPS.script, STEPS.socialPost],
}

// TODO: remove these once we replace old dashboard view with new task flow
// legacy type "sms" uses the same steps as "texting"
STEPS_BY_TYPE[LEGACY_TASK_TYPES.sms] = STEPS_BY_TYPE[TASK_TYPES.text]
// legacy type "telemarketing" uses the same steps as "robocall"
STEPS_BY_TYPE[LEGACY_TASK_TYPES.telemarketing] =
  STEPS_BY_TYPE[TASK_TYPES.robocall]
