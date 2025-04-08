// NOTE: copied from CampaignTaskType enum in gp-api
export const TASK_TYPES = {
  texting: 'texting',
  robocall: 'robocall',
  doorKnocking: 'door-knocking',
  phoneBanking: 'phone-banking',
  socialMedia: 'social-media',
  events: 'events',
}

export const STEPS = {
  intro: 'intro',
  budget: 'budget',
  audience: 'audience',
  script: 'script',
  image: 'image',
  schedule: 'schedule',
  complete: 'complete',
  download: 'download',
  socialPost: 'socialPost',
}

export const STEPS_BY_TYPE = {
  [TASK_TYPES.texting]: [
    STEPS.intro,
    STEPS.budget,
    STEPS.audience,
    STEPS.script,
    STEPS.image,
    STEPS.schedule,
    STEPS.complete,
  ],
  [TASK_TYPES.robocall]: [
    STEPS.intro,
    STEPS.audience,
    STEPS.script,
    STEPS.schedule,
    STEPS.complete,
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

  // Legacy types, these are based on voter file types
  sms: [
    STEPS.intro,
    STEPS.budget,
    STEPS.audience,
    STEPS.script,
    STEPS.image,
    STEPS.schedule,
    STEPS.complete,
  ],
  telemarketing: [
    STEPS.intro,
    STEPS.budget,
    STEPS.audience,
    STEPS.script,
    STEPS.schedule,
    STEPS.complete,
  ],
}
