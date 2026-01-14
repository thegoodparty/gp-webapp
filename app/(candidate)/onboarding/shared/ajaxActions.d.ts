import { Campaign } from 'helpers/types'

export function updateCampaign(
  attr: { key: string; value: unknown }[] | { key: string; value: unknown },
  slug?: string
): Promise<Campaign | false>

export function getCampaign(): Promise<Campaign | false>

export function fetchCampaignVersions(): Promise<Record<string, string | number | boolean | object | null>>

export function parseNumericOnboardingStep(currentStep?: string): number

export function onboardingStep(campaign: Campaign | null, step: number): string

export function doPostAuthRedirect(existingCampaign?: Campaign | null): Promise<string | false | undefined>

export function updateUserMeta(meta: Record<string, unknown>): Promise<Record<string, unknown> | false>
