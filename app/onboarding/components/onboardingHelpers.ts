import type {
  OnboardingStepConfig,
  NonEmptyArray,
  OnboardingAnswers,
  OnboardingStepId,
} from './onboardingTypes'

export const getVisibleOnboardingSteps = (
  steps: NonEmptyArray<OnboardingStepConfig>,
  answers: OnboardingAnswers,
): NonEmptyArray<OnboardingStepConfig> => {
  const visible = steps.filter((step) => !step.shouldSkip?.({ answers }))
  const [firstVisible, ...remainingVisible] = visible

  return firstVisible ? [firstVisible, ...remainingVisible] : [steps[0]]
}

export const getNextOnboardingStep = (
  steps: NonEmptyArray<OnboardingStepConfig>,
  activeStepId: OnboardingStepId,
  answers: OnboardingAnswers,
): OnboardingStepConfig | null => {
  const visibleSteps = getVisibleOnboardingSteps(steps, answers)
  const activeIndex = visibleSteps.findIndex((step) => step.id === activeStepId)
  if (activeIndex === -1) {
    return null
  }

  return visibleSteps[activeIndex + 1] ?? null
}

export const getPreviousOnboardingStep = (
  steps: NonEmptyArray<OnboardingStepConfig>,
  activeStepId: OnboardingStepId,
  answers: OnboardingAnswers,
): OnboardingStepConfig | null => {
  const visibleSteps = getVisibleOnboardingSteps(steps, answers)
  const activeIndex = visibleSteps.findIndex((step) => step.id === activeStepId)
  return activeIndex > 0 ? visibleSteps[activeIndex - 1] ?? null : null
}
