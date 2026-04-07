'use client'
import { useOrganization } from '@shared/organization-picker'
import { useCampaign } from '@shared/hooks/useCampaign'

export const usePositionName = (): string => {
  const organization = useOrganization()
  const [campaign] = useCampaign()
  return organization?.positionName || campaign?.positionName || ''
}
