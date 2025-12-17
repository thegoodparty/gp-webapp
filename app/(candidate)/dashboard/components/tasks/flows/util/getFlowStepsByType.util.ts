import {
  STEPS,
  STEPS_BY_TYPE,
} from 'app/(candidate)/dashboard/shared/constants/tasks.const'
import { OUTREACH_TYPES } from 'app/(candidate)/dashboard/outreach/constants'

export const getFlowStepsByType =
  (type: string, p2pUxEnabled: boolean = true) =>
  () => {
    const steps = STEPS_BY_TYPE[type]
    if (type === OUTREACH_TYPES.text && !p2pUxEnabled && steps) {
      return steps.filter((step: string) => step !== STEPS.purchase)
    }
    return steps
  }
