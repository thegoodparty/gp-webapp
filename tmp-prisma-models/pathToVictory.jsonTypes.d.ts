import { P2VStatus } from 'src/elections/types/pathToVictory.types'
import {
  P2VSource,
  ViabilityScore,
} from 'src/pathToVictory/types/pathToVictory.types'

export {}

declare global {
  export namespace PrismaJson {
    // New name for this will likely be "RaceTargetDetails" - which is currently reflected in elections.service functions
    // TODO: Rename everything P2V
    export type PathToVictoryData = {
      p2vStatus?: P2VStatus
      p2vAttempts?: number
      p2vCompleteDate?: string
      completedBy?: number
      electionType?: string
      electionLocation?: string
      voterContactGoal?: number
      winNumber?: number
      p2vNotNeeded?: boolean
      totalRegisteredVoters?: number
      republicans?: number
      democrats?: number
      indies?: number
      women?: number
      men?: number
      white?: number
      asian?: number
      africanAmerican?: number
      hispanic?: number
      averageTurnout?: number
      projectedTurnout?: number
      viability?: ViabilityScore
      source?: P2VSource
      districtId?: string
      districtManuallySet?: boolean
    }
  }
}
