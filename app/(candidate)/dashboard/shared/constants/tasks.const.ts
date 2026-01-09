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

type TaskTypeKey = keyof typeof TASK_TYPES
type LegacyTaskTypeKey = keyof typeof LEGACY_TASK_TYPES

type StepsByTypeMap = {
  [K in typeof TASK_TYPES[TaskTypeKey] | typeof LEGACY_TASK_TYPES[LegacyTaskTypeKey]]?: string[]
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
