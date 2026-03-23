import { Campaign } from './types'

export interface NextElection {
  nextElectionDate: string
  isPrimary: boolean
}

export const getNextElection = (
  campaign: Campaign | null,
): NextElection | null => {
  if (!campaign) return null
  const { electionDate, primaryElectionDate } = campaign.details ?? {}

  if (primaryElectionDate) {
    const primaryDateObj = new Date(
      String(primaryElectionDate).replace(/-/g, '/'),
    )
    if (primaryDateObj > new Date()) {
      return { nextElectionDate: String(primaryElectionDate), isPrimary: true }
    }
  }

  if (electionDate) {
    return { nextElectionDate: String(electionDate), isPrimary: false }
  }

  return null
}
