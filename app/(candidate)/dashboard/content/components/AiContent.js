'use client'

import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions'
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons'
import CampaignPlanSection from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/CampaignPlanSection'
import { useState } from 'react'

const sections = [
  {
    key: 'slogan',
    title: 'Slogans',
    icon: '/images/dashboard/slogan-icon.svg',
  },
  {
    key: 'messageBox',
    title: 'Campaign Positioning',
    icon: '/images/dashboard/positioning-icon.svg',
  },
  {
    key: 'communicationsStrategy',
    title: 'Communication Strategy',
    icon: '/images/dashboard/strategy-icon.svg',
  },
  {
    key: 'policyPlatform',
    title: 'My Policies',
    icon: '/images/dashboard/policies-icon.svg',
  },
  {
    key: 'why',
    title: "Why I'm Running",
    icon: '/images/dashboard/running-icon.svg',
  },
  {
    key: 'aboutMe',
    title: 'My Persona',
    icon: '/images/dashboard/persona-icon.svg',
  },
  {
    key: 'pathToVictory',
    title: 'Voter Report',
    icon: '/images/dashboard/voter-icon.svg',
  },
  {
    key: 'mobilizing',
    title: 'Mobilizing voters & volunteers',
    icon: '/images/dashboard/mobilizing-icon.svg',
  },
]

export default function AiContent({ campaign }) {
  const versions = useVersions()
  const [updatedVersions, setUpdatedVersions] = useState(false)

  const updateVersionsCallback = async () => {
    const versions = await fetchCampaignVersions()
    setUpdatedVersions(versions)
  }

  return (
    <div>
      {sections.map((section) => (
        <CampaignPlanSection
          key={section.key}
          section={section}
          campaign={campaign}
          versions={updatedVersions || versions}
          updateVersionsCallback={updateVersionsCallback}
        />
      ))}
    </div>
  )
}
