import { Poll, PollStatus } from './poll-types'
import { addBusinessDays, startOfDay } from 'date-fns'

export const isPollExpanding = (poll: Poll) =>
  poll.status !== PollStatus.COMPLETED && !!poll.responseCount

export const pollEstimatedCompletionDate = (scheduledDate: Date) =>
  addBusinessDays(startOfDay(scheduledDate), 3)
