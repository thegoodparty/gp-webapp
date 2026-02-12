'use client'
import Checkbox from '@shared/inputs/Checkbox'
import { useState, ChangeEvent } from 'react'
import { CandidateFieldSelect } from './CandidateFieldSelect'
import { CANDIDATE_TIERS } from './candidate-tiers.constant'
import { IS_VERIFIED_OPTIONS } from './is-verified-options.constant'
import { P2VSection } from 'app/admin/victory-path/[slug]/components/P2VSection'
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import { updateCampaignAdminOnly } from 'app/admin/shared/updateCampaignAdminOnly'
import { SelectChangeEvent } from '@mui/material'

interface FieldConfig {
  key: 'isVerified' | 'tier' | 'didWin'
  label: string
}

interface FieldState {
  isVerified: string | boolean | null | undefined
  tier: string | null | undefined
  didWin: boolean | undefined
}

const fields: FieldConfig[] = [
  { key: 'isVerified', label: 'Is Verified?' },
  { key: 'tier', label: 'Tier' },
  { key: 'didWin', label: 'Did win election?' },
]

export default function AdditionalFieldsSection(): React.JSX.Element {
  const [campaign, _, refreshCampaign] = useAdminCampaign()
  const { isVerified, tier, didWin } = campaign || {}
  const [state, setState] = useState<FieldState>({
    isVerified: isVerified ?? undefined,
    tier: tier ?? undefined,
    didWin: didWin ?? undefined,
  })

  const handleChange = async (
    key: keyof FieldState,
    value: string | boolean | null,
  ): Promise<void> => {
    const newState = { ...state, [key]: value }
    setState(newState)
    await updateCampaignAdminOnly({
      id: campaign?.id || 0,
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
              value={state[field.key] ?? null}
              onChange={(e: SelectChangeEvent<string | boolean | null>) =>
                handleChange(field.key, e.target.value)
              }
              valueMapping={
                field.key === 'isVerified'
                  ? IS_VERIFIED_OPTIONS
                  : CANDIDATE_TIERS
              }
            />
          ) : (
            <Checkbox
              value={state[field.key]}
              defaultChecked={campaign?.didWin ?? false}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(field.key, e.target.checked)
              }
            />
          )}
          <div className="ml-2">{field.label}</div>
        </div>
      ))}
    </P2VSection>
  )
}
