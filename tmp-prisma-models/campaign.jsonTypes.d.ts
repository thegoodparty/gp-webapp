import { User } from '@prisma/client'
import {
  AiContentData,
  AiContentGenerationStatus,
} from 'src/campaigns/ai/content/aiContent.types'
import {
  BallotReadyPositionLevel,
  CampaignCreatedBy,
  CampaignLaunchStatus,
  ElectionLevel,
  OnboardingStep,
  VoterGoals,
} from 'src/campaigns/campaigns.types'
import { HubSpot } from 'src/crm/crm.types'
import { CustomVoterFile } from 'src/voters/voterFile/voterFile.types'

export {}

declare global {
  export namespace PrismaJson {
    // Take care not to duplicate a field on both details and data
    export type CampaignDetails = {
      state?: string
      ballotLevel?: BallotReadyPositionLevel
      electionDate?: string
      primaryElectionDate?: string
      zip?: User['zip']
      knowRun?: 'yes' | null
      runForOffice?: 'yes' | 'no' | null
      pledged?: boolean
      isProUpdatedAt?: number // TODO: make this an ISO dateTime string
      customIssues?: Record<'title' | 'position', string>[]
      runningAgainst?: Record<'name' | 'party' | 'description', string>[]
      geoLocation?: {
        geoHash?: string
        lng?: number
        lat?: number
      }
      geoLocationFailed?: boolean
      city?: string | null
      county?: string | null
      normalizedOffice?: string | null
      otherOffice?: string
      office?: string
      party?: string
      otherParty?: string
      district?: string
      raceId?: string
      level?: ElectionLevel | null
      noNormalizedOffice?: boolean
      website?: string
      pastExperience?: string | Record<string, string>
      occupation?: string
      funFact?: string
      campaignCommittee?: string
      statementName?: string
      subscriptionId?: string | null
      endOfElectionSubscriptionCanceled?: boolean
      subscriptionCanceledAt?: number | null
      subscriptionCancelAt?: number | null
      filingPeriodsStart?: string | null
      filingPeriodsEnd?: string | null
      officeTermLength?: string
      partisanType?: string
      priorElectionDates?: string[]
      positionId?: string | null
      electionId?: string | null
      tier?: string
      einNumber?: string | null
      wonGeneral?: boolean
    }
    // TODO: Reconcile these w/ CampaignDetails once front-end catches up.
    //  No reason to have both.
    //  Take care not to duplicate a field on both details and data, for now.
    export type CampaignData = {
      createdBy?: CampaignCreatedBy
      slug?: string
      hubSpotUpdates?: Partial<Record<HubSpot.IncomingProperty, string>>
      currentStep?: OnboardingStep
      launchStatus?: CampaignLaunchStatus
      lastVisited?: number
      claimProfile?: string
      customVoterFiles?: CustomVoterFile[]
      reportedVoterGoals?: VoterGoals
      textCampaignCount?: number
      lastStepDate?: string
      adminUserEmail?: string
      hubspotId?: string
      name?: string
    }

    export type CampaignAiContent = {
      generationStatus?: Record<string, AiContentGenerationStatus>
      campaignPlanAttempts?: Record<string, number>
    } & Record<string, AiContentData>
  }
}
