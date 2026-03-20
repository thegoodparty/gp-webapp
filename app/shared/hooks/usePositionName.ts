'use client'
import { useOrganizationIfEnabled } from '@shared/organization-picker'
import { useCampaign } from '@shared/hooks/useCampaign'

export const usePositionName = (): string => {
  const organization = useOrganizationIfEnabled()
  const [campaign] = useCampaign()
  return organization?.positionName || campaign?.positionName || ''
}
