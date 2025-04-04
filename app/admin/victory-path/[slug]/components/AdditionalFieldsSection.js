'use client'
import Checkbox from '@shared/inputs/Checkbox'
import { useState } from 'react'
import { CandidateFieldSelect } from './CandidateFieldSelect'
import { CANDIDATE_TIERS } from './candidate-tiers.constant'
import { IS_VERIFIED_OPTIONS } from './is-verified-options.constant'
import { P2VSection } from 'app/admin/victory-path/[slug]/components/P2VSection'
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import { updateCampaignAdminOnly } from 'app/admin/shared/updateCampaignAdminOnly'

const fields = [
  { key: 'isVerified', label: 'Is Verified?' },
  { key: 'tier', label: 'Tier' },
  { key: 'didWin', label: 'Did win election?' },
]

export default function AdditionalFieldsSection() {
  const [campaign, _, refreshCampaign] = useAdminCampaign()
  const { isVerified, tier, didWin } = campaign
  const [state, setState] = useState({
    isVerified: isVerified ?? undefined,
    tier: tier ?? undefined,
    didWin: didWin ?? undefined,
  })

  const handleChange = async (key, value) => {
    const newState = { ...state, [key]: value }
    setState(newState)
    await updateCampaignAdminOnly({
      id: campaign.id,
      [key]: value,
    })
    await refreshCampaign()
  }

  return (
    <P2VSection title="Additional Fields">
      {fields.map((field) => (
        <div key={field.key} className="flex items-center">
          {['isVerified', 'tier'].includes(field.key) ? (
            <CandidateFieldSelect
              value={state[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              valueMapping={
                field.key === 'isVerified'
                  ? IS_VERIFIED_OPTIONS
                  : CANDIDATE_TIERS
              }
            />
          ) : (
            <Checkbox
              value={state[field.key]}
              defaultChecked={campaign[field.key]}
              onChange={(e) => handleChange(field.key, e.target.checked)}
            />
          )}
          <div className="ml-2">{field.label}</div>
        </div>
      ))}
    </P2VSection>
  )
}
