import { GoodPartyOrgLogo, Stepper } from '@styleguide'

interface OnboardingTopBarProps {
  currentStep: number
  totalSteps: number
}

const OnboardingTopBar = ({
  currentStep,
  totalSteps,
}: OnboardingTopBarProps): React.JSX.Element => (
  <div className="fixed top-0 inset-x-0 z-10 border-b border-base-border bg-base-surface">
    <div className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-8 sm:py-5">
      <div className="flex items-center justify-between">
        <GoodPartyOrgLogo />
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <Stepper
        variant="bar"
        showLabel={false}
        currentStep={currentStep}
        totalSteps={totalSteps}
        className="mt-4"
      />
    </div>
  </div>
)

export default OnboardingTopBar
