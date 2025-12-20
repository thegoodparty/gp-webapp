interface CampaignDetails {
  firstName?: string
  lastName?: string
  party?: string
  otherParty?: string
  state?: string
  office?: string
  officeTermLength?: string
  otherOffice?: string
  pastExperience?: string
  occupation?: string
  funFact?: string
  district?: string
  city?: string
  filedStatement?: boolean
  campaignCommittee?: string
  pledged?: boolean
  knowRun?: string
  primaryElectionDate?: string
}

interface CampaignPlan {
  slogan?: string
  aboutMe?: string
  why?: string
}

interface CampaignGoals {
  electionDate?: string
}

interface PathToVictory {
  voteGoal?: string | number
  voterProjection?: string | number
}

interface Campaign {
  slug: string
  details?: CampaignDetails
  campaignPlan?: CampaignPlan
  goals?: CampaignGoals
  pathToVictory?: PathToVictory
  color?: string
  image?: string
  twitter?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  tiktok?: string
  snap?: string
  twitch?: string
  hashtag?: string
  website?: string
  customIssues?: string[]
  endorsements?: string[]
  launchStatus?: string
  lastVisited?: string
}

interface MappedCandidate {
  slug: string
  firstName?: string
  lastName?: string
  party?: string
  state?: string
  office?: string
  officeTermLength?: string
  otherOffice?: string
  slogan?: string
  about?: string
  why?: string
  pastExperience?: string
  occupation?: string
  funFact?: string
  voteGoal: number
  voterProjection: number
  color?: string
  image?: string
  twitter?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  tiktok?: string
  snap?: string
  twitch?: string
  hashtag?: string
  website?: string
  district?: string
  city?: string
  customIssues?: string[]
  endorsements?: string[]
  launchStatus?: string
  lastVisited?: string
  filedStatement?: boolean
  campaignCommittee?: string
  primaryElectionDate?: string
  electionDate?: string
  pledged?: boolean
  knowRun?: string
}

export default function mapCampaignToCandidate(
  campaign: Campaign | null | undefined,
): MappedCandidate | false {
  if (!campaign) {
    return false
  }
  const {
    slug,
    details,
    campaignPlan,
    goals,
    pathToVictory,
    color,
    image,
    twitter,
    instagram,
    facebook,
    linkedin,
    tiktok,
    snap,
    twitch,
    hashtag,
    website,
    customIssues,
    endorsements,
    launchStatus,
    lastVisited,
  } = campaign
  const {
    firstName,
    lastName,
    party,
    otherParty,
    state,
    office,
    officeTermLength,
    otherOffice,
    pastExperience,
    occupation,
    funFact,
    district,
    city,
    filedStatement,
    campaignCommittee,
    pledged,
    knowRun,
    primaryElectionDate,
  } = details || {}
  const { slogan, aboutMe, why } = campaignPlan || {}

  const { electionDate } = goals || {}

  const { voteGoal, voterProjection } = pathToVictory || {}
  return {
    slug,
    firstName,
    lastName,
    party: party === 'Other' ? otherParty : party,
    state,
    office,
    officeTermLength,
    otherOffice,
    slogan,
    about: aboutMe,
    why,
    pastExperience,
    occupation,
    funFact,
    voteGoal: parseInt(String(voteGoal)) || 0,
    voterProjection: parseInt(String(voterProjection)) || 0,
    color,
    image,
    twitter,
    instagram,
    facebook,
    linkedin,
    tiktok,
    snap,
    twitch,
    hashtag,
    website,
    district,
    city,
    customIssues,
    endorsements,
    launchStatus,
    lastVisited,
    filedStatement,
    campaignCommittee,
    primaryElectionDate,
    electionDate,
    pledged,
    knowRun,
  }
}
