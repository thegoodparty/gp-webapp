import {
  STEPS,
  STEPS_BY_TYPE,
} from 'app/(candidate)/dashboard/shared/constants/tasks.const'
import { OUTREACH_TYPES } from 'app/(candidate)/dashboard/outreach/constants'

export const getFlowStepsByType =
  (type, p2pUxEnabled = true) =>
  () => {
    const steps = STEPS_BY_TYPE[type]
    if (type === OUTREACH_TYPES.text && !p2pUxEnabled) {
      return steps.filter((step) => step !== STEPS.purchase)
    }
    return steps
  }
