import {
  MdOutlineSignalCellularAlt,
  MdOutlineSignalCellularAlt1Bar,
  MdOutlineSignalCellularAlt2Bar,
} from 'react-icons/md'

interface ImpactLevels {
  low: 'low'
  medium: 'medium'
  high: 'high'
}

export const IMPACTS_LEVELS: ImpactLevels = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}

interface ImpactLevelIcons {
  low: React.JSX.Element
  medium: React.JSX.Element
  high: React.JSX.Element
}

export const IMPACT_LEVEL_ICONS: ImpactLevelIcons = {
  low: <MdOutlineSignalCellularAlt1Bar />,
  medium: <MdOutlineSignalCellularAlt2Bar />,
  high: <MdOutlineSignalCellularAlt />,
}

interface ImpactLevelLabels {
  low: string
  medium: string
  high: string
}

export const IMPACT_LEVELS_LABELS: ImpactLevelLabels = {
  low: 'Low Impact',
  medium: 'Medium Impact',
  high: 'High Impact',
}

export const NUM_OF_MOCK_OUTREACHES = 5

interface OutreachTypeMapping {
  p2pTexting: string
  doorKnocking: string
  phoneBanking: string
  socialMedia: string
}

export const OUTREACH_TYPE_MAPPING: OutreachTypeMapping = {
  p2pTexting: 'Text message',
  doorKnocking: 'Door knocking',
  phoneBanking: 'Phone banking',
  socialMedia: 'Social post',
}

export type AudienceLabelKey =
  | 'audienceSuperVoters'
  | 'audienceLikelyVoters'
  | 'audienceUnreliableVoters'
  | 'audienceUnlikelyVoters'
  | 'audienceFirstTimeVoters'
  | 'partyIndependent'
  | 'partyDemocrat'
  | 'partyRepublican'
  | 'age18_25'
  | 'age25_35'
  | 'age35_50'
  | 'age50Plus'
  | 'genderMale'
  | 'genderFemale'

interface AudienceLabelsMapping {
  audienceSuperVoters: string
  audienceLikelyVoters: string
  audienceUnreliableVoters: string
  audienceUnlikelyVoters: string
  audienceFirstTimeVoters: string
  partyIndependent: string
  partyDemocrat: string
  partyRepublican: string
  age18_25: string
  age25_35: string
  age35_50: string
  age50Plus: string
  genderMale: string
  genderFemale: string
}

export const AUDIENCE_LABELS_MAPPING: AudienceLabelsMapping = {
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

interface OutreachTypes {
  text: 'text'
  p2p: 'p2p'
  doorKnocking: 'doorKnocking'
  phoneBanking: 'phoneBanking'
  socialMedia: 'socialMedia'
  robocall: 'robocall'
}

// Based off the OutreachType in gp-api
export const OUTREACH_TYPES: OutreachTypes = {
  text: 'text',
  p2p: 'p2p',
  doorKnocking: 'doorKnocking',
  phoneBanking: 'phoneBanking',
  socialMedia: 'socialMedia',
  robocall: 'robocall',
}

interface OutreachActionsTypes {
  copyScript: 'copyScript'
  downloadAudience: 'downloadAudience'
}

export const OUTREACH_ACTIONS_TYPES: OutreachActionsTypes = {
  copyScript: 'copyScript',
  downloadAudience: 'downloadAudience',
}

interface FreeTextsOffer {
  COUNT: number
}

export const FREE_TEXTS_OFFER: FreeTextsOffer = {
  COUNT: 5000,
}
