import type {
  NewOnboardingPayload,
  NewOnboardingStep,
  NonEmptyArray,
  OnboardingAnswers,
  OnboardingStepId,
} from './newOnboardingTypes'

export const getVisibleOnboardingSteps = (
  steps: NonEmptyArray<NewOnboardingStep>,
  answers: OnboardingAnswers,
): NonEmptyArray<NewOnboardingStep> => {
  const visible = steps.filter((step) => !step.shouldSkip?.({ answers }))
  const [firstVisible, ...remainingVisible] = visible

  return firstVisible ? [firstVisible, ...remainingVisible] : [steps[0]]
}

export const getActiveOnboardingStep = (
  steps: NonEmptyArray<NewOnboardingStep>,
  activeStepId: OnboardingStepId,
  answers: OnboardingAnswers,
): NewOnboardingStep => {
  const visibleSteps = getVisibleOnboardingSteps(steps, answers)
  return (
    visibleSteps.find((step) => step.id === activeStepId) ?? visibleSteps[0]
  )
}

export const getNextOnboardingStep = (
  steps: NonEmptyArray<NewOnboardingStep>,
  activeStepId: OnboardingStepId,
  answers: OnboardingAnswers,
): NewOnboardingStep | null => {
  const visibleSteps = getVisibleOnboardingSteps(steps, answers)
  const activeIndex = visibleSteps.findIndex((step) => step.id === activeStepId)
  if (activeIndex === -1) {
    return null
  }

  return visibleSteps[activeIndex + 1] ?? null
}

export const getPreviousOnboardingStep = (
  steps: NonEmptyArray<NewOnboardingStep>,
  activeStepId: OnboardingStepId,
  answers: OnboardingAnswers,
): NewOnboardingStep | null => {
  const visibleSteps = getVisibleOnboardingSteps(steps, answers)
  const activeIndex = visibleSteps.findIndex((step) => step.id === activeStepId)
  return activeIndex > 0 ? visibleSteps[activeIndex - 1] ?? null : null
}

export const getOnboardingPayload = (
  answers: OnboardingAnswers,
): NewOnboardingPayload => ({
  version: 1,
  officeSelection: {
    mode: answers.officePath ?? null,
    manualOffice: answers.manualOffice === true,
    unmatchedOffice: answers.unmatchedOffice === true,
  },
  answers,
})
