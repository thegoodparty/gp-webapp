import { BiasAnalysisState } from '../shared/components/poll-text-bias/PollTextBiasInput'

export const MIN_QUESTION_LENGTH = 25
export const MAX_QUESTION_LENGTH = 1500

export function validatePollQuestion(value: string): string | true {
  const trimmedValue = value.trim()

  if (trimmedValue.length === 0) {
    return true 
  }

  if (trimmedValue.length < MIN_QUESTION_LENGTH) {
    return `Question must be at least ${MIN_QUESTION_LENGTH} characters`
  }

  if (trimmedValue.length > MAX_QUESTION_LENGTH) {
    return `Question must be less than ${MAX_QUESTION_LENGTH} characters`
  }

  return true
}

export function getWarningMessage(
  biasAnalysisState: BiasAnalysisState | null
): string | null {
  if (!biasAnalysisState?.hasBeenChecked) return null
  if (biasAnalysisState.hasServerError) {
    return 'Unable to check for bias. You can still proceed or try again later.'
  }
  const issues = []
  if (biasAnalysisState.hasBias) issues.push('Biased language detected')
  if (biasAnalysisState.hasGrammar) issues.push('Grammar issues found')
  if (issues.length === 0) return null
  return `${issues.join('. ')}. Please use "Optimize message" to correct it.`
}
