import { PollStatus } from './poll-types'

export const POLL_STATUS_LABELS: Record<PollStatus, string> = {
  [PollStatus.COMPLETED]: 'Completed',
  [PollStatus.IN_PROGRESS]: 'In Progress',
  [PollStatus.SCHEDULED]: 'Scheduled',
}

/** In dollars */
export const PRICE_PER_POLL_TEXT = 0.035

export const MAX_CONSTITUENTS_PER_RUN = 10000
