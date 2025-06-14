import {
  MdOutlineSignalCellularAlt,
  MdOutlineSignalCellularAlt1Bar,
  MdOutlineSignalCellularAlt2Bar,
} from 'react-icons/md'

export const IMPACTS_LEVELS = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}
export const IMPACT_LEVEL_ICONS = {
  low: <MdOutlineSignalCellularAlt1Bar />,
  medium: <MdOutlineSignalCellularAlt2Bar />,
  high: <MdOutlineSignalCellularAlt />,
}
export const IMPACT_LEVELS_LABELS = {
  low: 'Low Impact',
  medium: 'Medium Impact',
  high: 'High Impact',
}

export const NUM_OF_MOCK_OUTREACHES = 5

export const OUTREACH_TYPE_MAPPING = {
  p2pTexting: 'Text message',
  doorKnocking: 'Door knocking',
  phoneBanking: 'Phone banking',
}
export const AUDIENCE_LABELS_MAPPING = {
  audienceSuperVoters: 'Super',
  audienceLikelyVoters: 'Likely',
  audienceUnreliableVoters: 'Unreliable',
  audienceUnlikelyVoters: 'Unlikely',
  audienceFirstTimeVoters: 'First Time',
  partyIndependent: 'Independent',
  partyDemocrat: 'Democrat',
  partyRepublican: 'Republican',
  age18_25: '18-25',
  age25_35: '25-35',
  age35_50: '35-50',
  age50Plus: '50+',
  genderMale: 'Male',
  genderFemale: 'Female',
}

// Based off the OutreachType in gp-api
export const OUTREACH_TYPES = {
  text: 'text',
  doorKnocking: 'doorKnocking',
  phoneBanking: 'phoneBanking',
  socialMedia: 'socialMedia',
  robocall: 'robocall',
}
