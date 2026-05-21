import type { TcrCompliance } from 'helpers/types'

export type PinChannel = 'email' | 'phone' | 'address'

const isFilled = (value: string | null | undefined): boolean =>
  Boolean(value && value.trim().length > 0)

// CampaignVerify only delivers a PIN to the channels the candidate provided
// on the filing details form, so the helper text should reflect what was
// actually submitted on the TcrCompliance record.
export const getPinChannels = (
  tcrCompliance: TcrCompliance | null | undefined,
): PinChannel[] => {
  if (!tcrCompliance) return []
  const channels: PinChannel[] = []
  if (isFilled(tcrCompliance.email)) channels.push('email')
  if (isFilled(tcrCompliance.phone)) channels.push('phone')
  if (isFilled(tcrCompliance.postalAddress)) channels.push('address')
  return channels
}

export const formatPinChannels = (channels: PinChannel[]): string => {
  if (channels.length === 0) return ''
  if (channels.length === 1) return channels[0]!
  if (channels.length === 2) return `${channels[0]} or ${channels[1]}`
  return `${channels.slice(0, -1).join(', ')} or ${
    channels[channels.length - 1]
  }`
}
