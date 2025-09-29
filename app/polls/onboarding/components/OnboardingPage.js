'use client'
import { useState } from 'react'
import { StepFooter } from '@shared/stepper'
import InsightsStep from './steps/InsightsStep'
import OutreachStep from './steps/OutreachStep'
import StrategyStep from './steps/StrategyStep'
import AddImageStep from './steps/AddImageStep'
import PreviewStep from './steps/PreviewStep'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import { DemoMessageText } from './DemoMessageText'

const steps = [
    {
      name: 'Insights',
      nextLabel: 'Gather Feedback',
      showFooter: true,
      allowBack: false,
      stepIndex: 1,
      backLabel: 'Back',
    },
    {
      name: 'Outreach Prelude',
      nextLabel: 'Create poll',
      showFooter: true,
      allowBack: true,
      stepIndex: 2,
      backLabel: 'Back',
    },
    // Commented this out for now to avoid confusion, as we are adding the non-compliant step in the future and are only focusing on the happy path for now.
    // {
    //   name: 'Non-Compliant',
    //   nextLabel: 'Get Compliant',
    //   showFooter: true,
    //   allowBack: true,
    //   stepIndex: 2,
    //   backLabel: 'Back',
    // },
    {
      name: 'Strategy',
      nextLabel: 'Add Image',
      showFooter: true,
      allowBack: true,
      stepIndex: 3,
      backLabel: 'Back',
    },
    {
      name: 'Add Image',
      nextLabel: 'See Preview',
      showFooter: true,
      allowBack: true,
      stepIndex: 4,
      backLabel: 'Back',
    },
    {
      name: 'Preview',
      nextLabel: 'Send SMS poll',
      showFooter: true,
      allowBack: true,
      stepIndex: 5,
      backLabel: 'Back',
    },
  ]

  const maxStepIndex = steps.map(step => step.stepIndex).reduce((a, b) => Math.max(a, b), 0)

export default function OnboardingPage({ pathname }) {

  const [campaign] = useCampaign()
  const [user] = useUser()
  
  const campaignOffice = campaign?.details?.otherOffice || campaign?.details?.office
  const userName = user?.name

  const demoMessageText = DemoMessageText({ name: userName, office: campaignOffice, constituentName: 'Bill' })

  // TODO: Remove this once the TCR compliance check is ready. Do happy path for now.
  // const [tcrCompliant, isLoadingTcrCompliance, error] = useTcrComplianceCheck()
  const tcrCompliant = true
  const isLoadingTcrCompliance = false
  const isNextDisabled = false

  const [currentStepIndex, setCurrentStepIndex] = useState(1)

  const handleNext = () => {
    // tcrCompliant ? outreach : non-compliant
    if(currentStepIndex < maxStepIndex) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleBack = () => {
    if(currentStepIndex > 1) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const currentStep = steps.find(step => step.stepIndex === currentStepIndex)

  return (
    <div className="flex flex-col">
     
     <main className="flex-1 pb-140 md:pb-0">
        <section className="max-w-screen-md mx-auto bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12 xs:pt-4 md:mb-16">
          <div className="p-4 sm:p-8 lg:p-16 lg:pb-4">
            {currentStep.name === 'Insights' && (
              <InsightsStep />
            )}
            {currentStep.name === 'Outreach Prelude' && (
              <OutreachStep />
            )}
            {currentStep.name === 'Strategy' && (
              <StrategyStep demoText={demoMessageText} />
            )}
            {currentStep.name === 'Add Image' && (
              <AddImageStep />
            )}
            {currentStep.name === 'Preview' && (
              <PreviewStep demoText={demoMessageText} />
            )}
          </div>
         
           <div className="hidden md:block w-full border-t border-slate-200 pt-4 pb-4 px-8 lg:px-16">
            <StepFooter numberOfSteps={5} currentStep={currentStep.stepIndex} onBack={currentStep.allowBack ? handleBack : null} onBackText={currentStep.backLabel} disabledNext={isNextDisabled} onNext={handleNext} onNextText={currentStep.nextLabel} />
           </div>
        </section>
      </main>
      <div className="block md:hidden w-full fixed bottom-0 inset-x-0 bg-white z-10 px-4 sm:px-8">
        {currentStep.showFooter && (
          <StepFooter numberOfSteps={5} currentStep={currentStep.stepIndex} onBack={currentStep.allowBack ? handleBack : null} onBackText={currentStep.backLabel} disabledNext={isNextDisabled} onNext={handleNext} onNextText={currentStep.nextLabel} />
        )}
      </div>
    </div>
  )
}
