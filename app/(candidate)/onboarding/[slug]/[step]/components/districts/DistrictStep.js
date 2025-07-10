'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import PortalPanel from '@shared/layouts/PortalPanel'
import H2 from '@shared/typography/H2'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import DistrictNameAutocomplete from './DistrictNameAutocomplete'
import DistrictTypeAutocomplete from './DistrictTypeAutocomplete'

async function updateDistrict(L2DistrictType, L2DistrictName, slug) {
  await clientFetch(apiRoutes.campaign.district, {
    slug,
    L2DistrictType,
    L2DistrictName,
  })
}

export default function DistrictStep({ campaign, step, adminMode, ...props }) {
  const router = useRouter()
  const electionYear = new Date(campaign.details.electionDate).getFullYear()
  const { state } = campaign.details

  const [type, setType] = useState(null)
  const [name, setName] = useState(null)
  const [processing, setProcessing] = useState(false)

  const canSubmit = !!type && !!name && !processing

  const handleContinue = async () => {
    if (!canSubmit) return
    setProcessing(true)
    try {
      await updateDistrict(
        type.L2DistrictType,
        name.L2DistrictName,
        adminMode ? campaign.slug : undefined,
      )
      router.push(`/onboarding/${campaign.slug}/${step + 1}`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <PortalPanel color="#2CCDB0" {...props}>
      <div className="mt-8">
        <H2 className="mb-8">Select Your District</H2>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <DistrictTypeAutocomplete
            value={type}
            onChange={(v) => {
              setType(v)
              setName(null) // reset name when type changes
            }}
            state={state}
            electionYear={electionYear}
          />

          <DistrictNameAutocomplete
            value={name}
            onChange={setName}
            districtType={type?.L2DistrictType}
            state={state}
            electionYear={electionYear}
            disabled={!type}
          />
        </div>

        <div className="flex justify-end mt-8">
          <BlackButtonClient onClick={handleContinue} disabled={!canSubmit}>
            <strong>{processing ? 'Saving…' : 'Continue'}</strong>
          </BlackButtonClient>
        </div>
      </div>
    </PortalPanel>
  )
}
