'use client'

import H3 from '@shared/typography/H3'
import H5 from '@shared/typography/H5'
import { BsMegaphone } from 'react-icons/bs'
import { FiShare2 } from 'react-icons/fi'
import { GrMicrophone } from 'react-icons/gr'
import { GoPeople } from 'react-icons/go'
import { AiOutlineFlag } from 'react-icons/ai'
import { FaHandHoldingHeart } from 'react-icons/fa'
import { HiOutlineScale } from 'react-icons/hi'
import { SiMinutemailer } from 'react-icons/si'
import Caption from '@shared/typography/Caption'
import { calcAnswers } from '../../shared/QuestionProgress'
import { buildTrackingAttrs, trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Campaign, CandidatePosition } from 'helpers/types'
import { KeyboardEvent } from 'react'

const TEMPLATE_CATEGORY_ICONS = {
  'Email Blasts': <SiMinutemailer className="text-purple-300" />,
  'Media & PR': <BsMegaphone className="text-orange-600" />,
  'Social Media Content': <FiShare2 className="text-cyan-600" />,
  'Speeches & Scripts': <GrMicrophone className="text-purple-800" />,
  'Outreach & Community Engagement': <GoPeople className="text-lime-900" />,
  'Campaign Milestones': <AiOutlineFlag className="text-green-600" />,
  'Issues & Policy': <HiOutlineScale className="text-cyan-800" />,
  'Endorsements & Partnerships': (
    <FaHandHoldingHeart className="text-red-400" />
  ),
}

type TemplateCategoryKey = keyof typeof TEMPLATE_CATEGORY_ICONS

const isTemplateCategoryKey = (key: string): key is TemplateCategoryKey =>
  key in TEMPLATE_CATEGORY_ICONS

const getTemplateCategoryIcon = (name: string): React.JSX.Element | undefined =>
  isTemplateCategoryKey(name) ? TEMPLATE_CATEGORY_ICONS[name] : undefined

interface Template {
  key: string
  name: string
}

interface Category {
  name: string
  templates: Template[]
}

interface TemplateListProps {
  categories: Category[]
  onSelectCallback: (key: string) => void
  selectedKey: string
  requiresQuestions: Partial<Record<string, boolean>>
  campaign: Campaign | null
  candidatePositions: CandidatePosition[] | null
}

const TemplateList = ({
  categories,
  onSelectCallback,
  selectedKey,
  requiresQuestions,
  campaign,
  candidatePositions,
}: TemplateListProps): React.JSX.Element => {
  const handleClick = (key: string) => {
    if (requiresQuestions[key]) {
      const { answeredQuestions, totalQuestions } = calcAnswers(
        campaign,
        candidatePositions,
      )

      if (answeredQuestions >= totalQuestions) {
        onSelectCallback(key)
      }
    } else {
      onSelectCallback(key)
    }
  }

  return (
    <>
      {categories.map((category) => (
        <div key={category.name} className="mt-9 mb-4">
          <H3>{category.name}</H3>
          <div className="grid grid-cols-12 gap-3 mt-4">
            {category.templates.map((template) => {
              const trackingAttrs = buildTrackingAttrs(
                'Generate AI Content Button',
                {
                  category: category.name,
                  key: template.key,
                },
              )

              return (
                <div
                  key={template.key}
                  className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    {...trackingAttrs}
                    onClick={() => {
                      trackEvent(EVENTS.ContentBuilder.SelectTemplate, {
                        category: category.name,
                        key: template.key,
                      })
                      handleClick(template.key)
                    }}
                    onKeyDown={(e: KeyboardEvent) =>
                      e.key === 'Enter' && handleClick(template.key)
                    }
                    id={`template-card-${template.key}`}
                    className={`generate-content bg-gray-50 border flex md:flex-col  rounded-xl pt-5 px-7 pb-5 md:pb-14 ${
                      selectedKey === template.key
                        ? ' shadow-lg border-black'
                        : 'border-slate-700'
                    } transition duration-300 ease-in-out  
                  
                  ${
                    requiresQuestions[template.key]
                      ? 'opacity-40 cursor-not-allowed'
                      : 'cursor-pointer hover:shadow-lg'
                  }
                  
                  `}
                  >
                    <div className="mr-3 md:mr-0 md:mb-4 text-2xl ">
                      {getTemplateCategoryIcon(category.name)}
                    </div>
                    <H5>{template.name}</H5>
                  </div>
                  {requiresQuestions[template.key] && (
                    <Caption className="mt-2 text-center">
                      Answer all questions to unlock
                    </Caption>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}

export default TemplateList
