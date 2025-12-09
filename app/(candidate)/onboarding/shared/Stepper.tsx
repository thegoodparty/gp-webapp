import Link from 'next/link'
import { Fragment } from 'react'

interface StepperProps {
  step: number
  totalSteps: number
  campaign: { slug: string }
}

export default function Stepper(props: StepperProps): React.JSX.Element {
  const { step, totalSteps, campaign } = props

  return (
    <div className="flex items-center justify-center py-8 lg:py-0 lg:fixed lg:top-5 lg:w-[calc(100vw-300px)] lg:left-[150px] lg:z-50">
      {[...Array(totalSteps)].map((_e, i) => (
        <Fragment key={i}>
          <Link
            href={step > i + 1 ? `/onboarding/${campaign.slug}/${i + 1}` : '#'}
          >
            <div
              className={`h-[18px] w-[18px] flex items-center justify-center rounded-full${
                step === i + 1 && ' border border-purple-400'
              } `}
            >
              <div
                className={`h-3 w-3 rounded-full ${
                  step > i + 1 && 'bg-black'
                } ${step === i + 1 && 'bg-purple-400'} ${
                  step < i + 1 && 'bg-indigo-50'
                }`}
              ></div>
            </div>
          </Link>
          {i < totalSteps - 1 && (
            <div className="h-[2px] bg-indigo-50 w-8  lg:w-[72px] mx-2" />
          )}
        </Fragment>
      ))}
    </div>
  )
}

