import Body2 from '@shared/typography/Body2'
import H5 from '@shared/typography/H5'
import { IconType } from 'react-icons'
import {
  LuLink2,
  LuPencil,
  LuShare,
  LuBadgeCheck,
  LuMessageCircleMore,
  LuTrendingUp,
  LuLightbulb,
} from 'react-icons/lu'

interface Step {
  icon: IconType
  title: string
  description: string
}

type StepType = 'intro' | 'draft' | 'increaseVisitors'

const STEPS: Record<StepType, Step[]> = {
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
  increaseVisitors: [
    {
      icon: LuLightbulb,
      title: 'Share on social media',
      description:
        'Post your website link on Facebook, Twitter, Instagram, and LinkedIn to reach more voters.',
    },
    {
      icon: LuLightbulb,
      title: 'Email your supporters',
      description:
        'Send the website to your email list and ask them to share it with friends and family.',
    },
    {
      icon: LuLightbulb,
      title: 'Add to campaign materials',
      description:
        'Include your website URL on business cards, flyers, yard signs, and other campaign materials.',
    },
    {
      icon: LuLightbulb,
      title: 'Local media outreach',
      description:
        'Contact local newspapers, radio stations, and blogs to feature your campaign and website.',
    },
    {
      icon: LuLightbulb,
      title: 'Community events',
      description:
        'Attend town halls, community meetings, and local events to share your website with voters.',
    },
  ],
}

interface StepIconProps {
  Icon: IconType
}

function StepIcon({ Icon }: StepIconProps): React.JSX.Element {
  return (
    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
      <Icon className="text-blue-600" size={20} />
    </div>
  )
}

interface StepItemProps {
  icon: IconType
  title: string
  description: string
  forceColumn?: boolean
}

function StepItem({ icon, title, description, forceColumn = false }: StepItemProps): React.JSX.Element {
  return (
    <div
      className={`flex ${!forceColumn ? 'md:flex-col' : ''} items-center gap-4`}
    >
      <StepIcon Icon={icon} />
      <div>
        <H5 className="mb-1">{title}</H5>
        <Body2 className="text-gray-600">{description}</Body2>
      </div>
    </div>
  )
}

interface StepListProps {
  type?: StepType
  forceColumn?: boolean
}

export default function StepList({ type = 'intro', forceColumn = false }: StepListProps): React.JSX.Element {
  const steps = STEPS[type] || STEPS.intro

  return (
    <div
      className={`flex flex-col py-2 ${
        !forceColumn ? 'md:grid md:grid-cols-3' : ''
      }`}
    >
      {steps.map((step, idx) => (
        <div key={step.title}>
          <StepItem
            icon={step.icon}
            title={step.title}
            description={step.description}
            forceColumn={forceColumn}
          />
          {idx !== steps.length - 1 && (
            <div
              className={`${
                !forceColumn ? 'md:hidden' : ''
              } my-6 h-[1px] bg-black/[0.12]`}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}
