'use client'
import React, { useState } from 'react'
import H3 from '@shared/typography/H3'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import { useSnackbar } from 'helpers/useSnackbar'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import DistrictNameAutocomplete from 'app/(candidate)/onboarding/[slug]/[step]/components/districts/DistrictNameAutocomplete'
import DistrictTypeAutocomplete from 'app/(candidate)/onboarding/[slug]/[step]/components/districts/DistrictTypeAutocomplete'

async function updateDistrict(L2DistrictType, L2DistrictName, slug) {
  await clientFetch(apiRoutes.campaign.district, {
    slug,
    L2DistrictType,
    L2DistrictName,
  })
}

export default function AdminDistrictPicker({ campaign, refreshCampaign }) {
  const electionYear = new Date(campaign.details.electionDate).getFullYear()
  const { state: campaignState } = campaign.details

  const [type, setType] = useState(null)
  const [name, setName] = useState(null)
  const [processing, setProcessing] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const canSave = !!type && !!name && !processing

  const handleSave = async () => {
    if (!canSave) return
    setProcessing(true)
    try {
      await updateDistrict(type.L2DistrictType, name.L2DistrictName, campaign.slug)
      successSnackbar('District updated')
      refreshCampaign && (await refreshCampaign())
    } catch (e) {
      console.error(e)
      errorSnackbar('Error saving district')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="mb-12">
      <H3 className="text-2xl font-black mb-8">District Picker</H3>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">
          <DistrictTypeAutocomplete
            value={type}
            onChange={(v) => {
              setType(v)
              setName(null)
            }}
            state={campaignState}
            electionYear={electionYear}
          />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <DistrictNameAutocomplete
            value={name}
            onChange={setName}
            districtType={type?.L2DistrictType}
            state={campaignState}
            electionYear={electionYear}
            disabled={!type}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <BlackButtonClient onClick={handleSave} disabled={!canSave}>
          <strong>{processing ? 'Saving…' : 'Save'}</strong>
        </BlackButtonClient>
      </div>
    </div>
  )
}
