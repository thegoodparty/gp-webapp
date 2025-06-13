import Body2 from '@shared/typography/Body2'
import H5 from '@shared/typography/H5'

function StepNumber({ number }) {
  return (
    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xl">
      {number}
    </div>
  )
}

function StepItem({ number, title, description }) {
  return (
    <div className="flex md:flex-col items-start gap-4">
      <StepNumber number={number} />
      <div>
        <H5 className="mb-1">{title}</H5>
        <Body2 className="text-gray-600">{description}</Body2>
      </div>
    </div>
  )
}

export default function IntroSteps({ steps }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 py-2 text-left md:justify-between">
      {steps.map((step) => (
        <StepItem
          key={step.number}
          number={step.number}
          title={step.title}
          description={step.description}
        />
      ))}
    </div>
  )
}
