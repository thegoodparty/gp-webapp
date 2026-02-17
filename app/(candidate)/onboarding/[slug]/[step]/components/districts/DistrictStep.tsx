'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import PortalPanel from '@shared/layouts/PortalPanel'
import H2 from '@shared/typography/H2'
import DistrictPicker from './DistrictPicker'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface CampaignDetails {
  electionDate: string
  state: string
}

interface Campaign {
  slug: string
  details: CampaignDetails
}

interface DistrictStepProps {
  campaign: Campaign
  step: number
  adminMode?: boolean
  [key: string]: string | number | boolean | Campaign | undefined
}

const updateDistrict = (
  L2DistrictType: string,
  L2DistrictName: string,
  slug?: string,
) =>
  clientFetch(apiRoutes.campaign.district, {
    slug,
    L2DistrictType,
    L2DistrictName,
  })

export default function DistrictStep({
  campaign,
  step,
  adminMode,
  ...props
}: DistrictStepProps): React.JSX.Element {
  const router = useRouter()
  const electionYear = new Date(campaign.details.electionDate).getFullYear()
  const { state } = campaign.details

  const handleContinue = async (
    typeObj: { L2DistrictType: string } | null,
    nameObj: { L2DistrictName: string } | null,
  ) => {
    if (!typeObj || !nameObj) return
    await updateDistrict(
      typeObj.L2DistrictType,
      nameObj.L2DistrictName,
      adminMode ? campaign.slug : undefined,
    )
    router.push(`/onboarding/${campaign.slug}/${step + 1}`)
  }

  return (
    <PortalPanel color="#2CCDB0" {...props}>
      <div className="mt-8">
        <H2 className="mb-8">Select Your District</H2>

        <DistrictPicker
          state={state}
          electionYear={electionYear}
          buttonText="Continue"
          onSubmit={handleContinue}
          className="max-w-4xl mx-auto flex flex-col gap-6"
        />
      </div>
    </PortalPanel>
  )
}
