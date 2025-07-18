export const ISSUE_STATUSES = {
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  WONT_DO: 'wontDo',
}

export const VIEW_MODES = {
  LIST: 'list',
  BOARD: 'board',
}

export const BOARD_COLUMNS = {
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
}

export const COLUMN_TO_STATUS_MAP = {
  [BOARD_COLUMNS.ACCEPTED]: ISSUE_STATUSES.ACCEPTED,
  [BOARD_COLUMNS.IN_PROGRESS]: ISSUE_STATUSES.IN_PROGRESS,
  [BOARD_COLUMNS.COMPLETED]: ISSUE_STATUSES.COMPLETED,
}

export const STATUS_TO_COLUMN_MAP = {
  [ISSUE_STATUSES.ACCEPTED]: BOARD_COLUMNS.ACCEPTED,
  [ISSUE_STATUSES.IN_PROGRESS]: BOARD_COLUMNS.IN_PROGRESS,
  [ISSUE_STATUSES.COMPLETED]: BOARD_COLUMNS.COMPLETED,
  [ISSUE_STATUSES.WONT_DO]: BOARD_COLUMNS.COMPLETED,
}

export const getColumnTypeFromStatus = (status) =>
  STATUS_TO_COLUMN_MAP[status] || BOARD_COLUMNS.ACCEPTED

// Status display mapping for timeline
export const STATUS_DISPLAY_MAP = {
  submitted: {
    title: 'Issue Submitted',
    description: 'Issue has been submitted',
  },
  [ISSUE_STATUSES.ACCEPTED]: {
    title: 'Issue Accepted',
    description: 'Issue has been accepted',
  },
  [ISSUE_STATUSES.IN_PROGRESS]: {
    title: 'In Progress',
    description: 'Work is in progress',
  },
  [ISSUE_STATUSES.COMPLETED]: {
    title: 'Completed',
    description: 'Issue has been completed',
  },
  [ISSUE_STATUSES.WONT_DO]: {
    title: "Won't Do",
    description: 'Issue will not be addressed',
  },
}

