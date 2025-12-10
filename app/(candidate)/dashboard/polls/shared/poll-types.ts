export enum PollStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export type Poll = {
  id: string
  name: string
  status: PollStatus
  messageContent: string
  imageUrl?: string
  scheduledDate: string
  estimatedCompletionDate: string
  completedDate?: string
  audienceSize: number
  responseCount?: number
  lowConfidence?: boolean
  cost?: number
}

export type PollIssue = {
  pollId: string
  title: string
  summary: string
  details: string
  mentionCount: number
  representativeComments: Array<{
    comment: string
  }>
}
