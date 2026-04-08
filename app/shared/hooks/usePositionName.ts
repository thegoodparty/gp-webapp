'use client'
import { useOrganization } from '@shared/organization-picker'

export const usePositionName = (): string => {
  const organization = useOrganization()
  return organization.positionName || ''
}
