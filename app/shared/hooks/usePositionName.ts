'use client'
import { useOrganizationIfEnabled } from '@shared/organization-picker'

export const usePositionName = (): string => {
  const organization = useOrganizationIfEnabled()
  return organization?.name || ''
}
