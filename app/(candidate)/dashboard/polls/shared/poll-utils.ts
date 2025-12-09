import { Poll, PollStatus } from './poll-types'

export const isPollExpanding = (poll: Poll) =>
  poll.status !== PollStatus.COMPLETED && !!poll.responseCount
