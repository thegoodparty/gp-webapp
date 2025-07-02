import Body2 from '@shared/typography/Body2'
import H5 from '@shared/typography/H5'
import {
  LuLink2,
  LuPencil,
  LuShare,
  LuBadgeCheck,
  LuMessageCircleMore,
  LuTrendingUp,
} from 'react-icons/lu'

const STEPS = {
  intro: [
    {
      icon: LuLink2,
      title: 'Claim your custom link',
      description: 'Choose your custom GoodParty.org link',
    },
    {
      icon: LuPencil,
      title: 'Customize your site',
      description: 'Make your website uniquely yours',
    },
    {
      icon: LuShare,
      title: 'Publish & share',
      description: 'Go live and start reaching voters',
    },
  ],
  draft: [
    {
      icon: LuBadgeCheck,
      title: 'Increase your credibility',
      description: 'A professional website makes a great first impression',
    },
    {
      icon: LuMessageCircleMore,
      title: 'Control your own narrative',
      description:
        'Position yourself on issues in ways that appeal to your target voter base',
    },
    {
      icon: LuTrendingUp,
      title: 'Measure your impact',
      description: 'Track visitor count to gauge growing interest',
    },
  ],
}

function StepIcon({ Icon }) {
  return (
    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
      <Icon className="text-blue-600" size={20} />
    </div>
  )
}

function StepItem({ icon, title, description }) {
  return (
    <div className="flex md:flex-col items-center gap-4">
      <StepIcon Icon={icon} />
      <div>
        <H5 className="mb-1">{title}</H5>
        <Body2 className="text-gray-600">{description}</Body2>
      </div>
    </div>
  )
}

export default function StepList({ type = 'intro' }) {
  const steps = STEPS[type] || STEPS.intro

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 py-2">
      {steps.map((step, idx) => (
        <div key={step.title}>
          <StepItem
            icon={step.icon}
            title={step.title}
            description={step.description}
          />
          {idx !== steps.length - 1 && (
            <div className="md:hidden my-6 h-[1px] bg-black/[0.12]"></div>
          )}
        </div>
      ))}
    </div>
  )
}
