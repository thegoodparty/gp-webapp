'use client'

import { Button, Card, CardContent, GoodPartyOrgLogo } from '@styleguide'
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Compass,
  Target,
  UsersRound,
  Wand2,
} from 'lucide-react'
import { useState } from 'react'
import {
  NEW_ONBOARDING_STEPS,
  firstNewOnboardingStepId,
} from './newOnboardingConfig'
import { getVisibleOnboardingSteps } from './newOnboardingHelpers'
import type {
  NewOnboardingStep,
  OnboardingAnswers,
  OnboardingOfficePath,
  OnboardingStepId,
} from './newOnboardingTypes'

const pathLabels: Record<OnboardingOfficePath, string> = {
  structured: 'Known office',
  manual: 'Manual office',
}

const welcomeCards = [
  {
    title: 'Know how many votes you need to win',
    description:
      "We use real voter data and historical local turnout to project the number of votes you'll need to win.",
    Icon: Target,
  },
  {
    title: 'Learn what issues matter to your voters',
    description:
      'We analyze your local voter data to surface and rank their top issues and concerns.',
    Icon: UsersRound,
  },
  {
    title: 'Get a powerful outreach plan & materials',
    description:
      'We create personalized stump speeches, door-knocking scripts, fundraising emails, social posts, all drafted from your profile and platform.',
    Icon: Wand2,
  },
  {
    title: 'Plan with a budget and calendar of tasks',
    description:
      'We provide you with a minimum resources budget and an interactive weekly plan of tasks & actions that give you the best chances of winning.',
    Icon: CalendarCheck,
  },
]

interface WhyWeAskProps {
  text: string
}

const WhyWeAsk = ({ text }: WhyWeAskProps): React.JSX.Element => (
  <aside className="rounded-xl border border-slate-200 p-5">
    <div className="mb-3 flex items-center gap-2">
      <Compass className="size-4 text-slate-400" aria-hidden="true" />
      <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
        Why we ask
      </span>
    </div>
    <p className="text-sm leading-6 text-slate-700">{text}</p>
  </aside>
)

interface StepProgressProps {
  currentStep: number
  numberOfSteps: number
}

const StepProgress = ({
  currentStep,
  numberOfSteps,
}: StepProgressProps): React.JSX.Element => (
  <div
    className="space-y-3"
    role="progressbar"
    aria-label="Onboarding progress"
    aria-valuemin={1}
    aria-valuemax={numberOfSteps}
    aria-valuenow={currentStep}
  >
    <div className="flex justify-end text-sm font-medium text-slate-500">
      Step {currentStep} of {numberOfSteps}
    </div>
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${numberOfSteps}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: numberOfSteps }, (_, index) => (
        <div
          key={index}
          className={
            index < currentStep
              ? 'h-1.5 rounded-full bg-blue-600'
              : 'h-1.5 rounded-full bg-slate-100'
          }
        />
      ))}
    </div>
  </div>
)

interface StepBodyProps {
  activeStep: NewOnboardingStep
  answers: OnboardingAnswers
  updateAnswers: (answers: Partial<OnboardingAnswers>) => void
}

const StepBody = ({
  activeStep,
  answers,
  updateAnswers,
}: StepBodyProps): React.JSX.Element => {
  if (activeStep.id === 'welcome') {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {welcomeCards.map(({ title, description, Icon }) => (
            <Card
              key={title}
              className="rounded-xl border-slate-200 text-left shadow-none"
            >
              <CardContent className="space-y-4 p-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="space-y-2">
                  <h2 className="text-base leading-6 font-semibold text-slate-950">
                    {title}
                  </h2>
                  <p className="text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500">
          Ready? Hit{' '}
          <span className="font-semibold text-slate-950">Continue</span> to get
          started.
        </p>
      </div>
    )
  }

  if (activeStep.id === 'office-selection') {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant={answers.officePath === 'structured' ? 'default' : 'outline'}
          className="h-auto min-h-24 flex-col items-start rounded-lg p-5 text-left whitespace-normal"
          onClick={() =>
            updateAnswers({
              officePath: 'structured',
              manualOffice: false,
              unmatchedOffice: false,
            })
          }
        >
          <span className="font-semibold">Use a matched office</span>
          <span className="text-sm font-normal opacity-80">
            Candidate selected an office from structured election data.
          </span>
        </Button>
        <Button
          type="button"
          variant={answers.officePath === 'manual' ? 'default' : 'outline'}
          className="h-auto min-h-24 flex-col items-start rounded-lg p-5 text-left whitespace-normal"
          onClick={() =>
            updateAnswers({
              officePath: 'manual',
              manualOffice: true,
              unmatchedOffice: true,
            })
          }
        >
          <span className="font-semibold">Enter office manually</span>
          <span className="text-sm font-normal opacity-80">
            Candidate could not find their office in the search results.
          </span>
        </Button>
      </div>
    )
  }

  if (activeStep.id === 'manual-office-entry') {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-900">manualOffice</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {answers.manualOffice ? 'true' : 'false'}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-900">unmatchedOffice</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {answers.unmatchedOffice ? 'true' : 'false'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm leading-6 text-slate-700">{activeStep.summary}</p>
    </div>
  )
}

export default function NewOnboardingFlow(): React.JSX.Element {
  const [answers, setAnswers] = useState<OnboardingAnswers>({})
  const [activeStepId, setActiveStepId] = useState<OnboardingStepId>(
    firstNewOnboardingStepId,
  )

  const visibleSteps = getVisibleOnboardingSteps(NEW_ONBOARDING_STEPS, answers)
  const activeIndex = Math.max(
    0,
    visibleSteps.findIndex((step) => step.id === activeStepId),
  )
  const activeStep = visibleSteps[activeIndex] ?? visibleSteps[0]
  const previousStep = activeIndex > 0 ? visibleSteps[activeIndex - 1] : null
  const nextStep = visibleSteps[activeIndex + 1] ?? null
  const activeStepNumber = activeIndex + 1

  const updateAnswers = (answerPatch: Partial<OnboardingAnswers>) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, ...answerPatch }))
  }

  const goBack = () => {
    if (previousStep) {
      setActiveStepId(previousStep.id)
    }
  }

  const goNext = () => {
    if (nextStep) {
      setActiveStepId(nextStep.id)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-28 text-slate-950">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-2 px-4 sm:px-8">
          <GoodPartyOrgLogo className="h-6 w-auto lg:h-7 lg:w-auto" />
          <span className="text-base font-semibold text-slate-950">
            GoodParty.org
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
        <div
          className={`grid grid-cols-1 gap-8${
            activeStep.whyWeAsk
              ? ' md:grid-cols-[minmax(0,1fr)_280px] md:items-start'
              : ''
          }`}
        >
          <div>
            <StepProgress
              currentStep={activeStepNumber}
              numberOfSteps={visibleSteps.length}
            />

            <section
              className={`mt-8 space-y-8 sm:mt-5${
                activeStep.whyWeAsk ? '' : ' text-center'
              }`}
            >
              <div className="space-y-4">
                {activeStep.id === 'welcome' ? null : (
                  <p className="text-sm font-semibold text-blue-600">
                    {activeStep.eyebrow}
                  </p>
                )}
                <h1 className="mx-auto max-w-2xl text-4xl leading-[1.08] font-bold text-slate-950 sm:text-5xl">
                  {activeStep.title}
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-500 sm:text-base sm:leading-7">
                  {activeStep.description}
                </p>
                {answers.officePath ? (
                  <p className="text-sm font-medium text-slate-500">
                    {pathLabels[answers.officePath]}
                  </p>
                ) : null}
              </div>

              <StepBody
                activeStep={activeStep}
                answers={answers}
                updateAnswers={updateAnswers}
              />
            </section>
          </div>

          {activeStep.whyWeAsk ? <WhyWeAsk text={activeStep.whyWeAsk} /> : null}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white">
        <div className="mx-auto flex h-20 w-full max-w-4xl items-center justify-between px-4 sm:px-8">
          <Button
            type="button"
            variant="ghost"
            size="large"
            icon={<ArrowLeft aria-hidden="true" />}
            onClick={goBack}
            disabled={!previousStep}
            className="px-0 text-slate-500 disabled:opacity-50"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="default"
            size="large"
            icon={<ArrowRight aria-hidden="true" />}
            iconPosition="right"
            onClick={goNext}
            disabled={!nextStep}
            className="min-w-36"
          >
            {nextStep ? 'Continue' : 'Complete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
