// NOTE: copied from CampaignTaskType enum in gp-api
export const TASK_TYPES = {
  texting: 'texting',
  robocall: 'robocall',
  doorKnocking: 'door-knocking',
  phoneBanking: 'phone-banking',
  socialMedia: 'social-media',
  events: 'events',
}

export const TASK_TYPE_HEADINGS = {
  [TASK_TYPES.texting]: 'How many text messages did you schedule?',
  [TASK_TYPES.robocall]: 'How many robocalls did you schedule?',
  [TASK_TYPES.doorKnocking]: 'How many doors did you knock?',
  [TASK_TYPES.phoneBanking]: 'How many calls did you make?',
  [TASK_TYPES.socialMedia]: 'How views did your post get?',
  [TASK_TYPES.events]: 'How many voters did you meet?',
}

export const TASK_TYPE_LABELS = {
  [TASK_TYPES.texting]: 'Text Messages Scheduled',
  [TASK_TYPES.robocall]: 'Robocalls Scheduled',
  [TASK_TYPES.doorKnocking]: 'Doors Knocked',
  [TASK_TYPES.phoneBanking]: 'Calls Made',
  [TASK_TYPES.socialMedia]: 'Social Post Views',
  [TASK_TYPES.events]: 'Voters Met',
}
