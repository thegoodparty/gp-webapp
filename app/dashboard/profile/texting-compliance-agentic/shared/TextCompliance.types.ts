export const STEP_STATUS = {
  DISABLED: 'disabled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const

export type StepStatus = (typeof STEP_STATUS)[keyof typeof STEP_STATUS]
