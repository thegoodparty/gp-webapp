import { Campaign } from 'helpers/types'

export function updateCampaign(
  attr:
    | { key: string; value: string | number | boolean | object | null }[]
    | { key: string; value: string | number | boolean | object | null },
  slug?: string
): Promise<Campaign | false>

export function getCampaign(): Promise<Campaign | false>

export function fetchCampaignVersions(): Promise<
  Partial<Record<string, string | number | boolean | object | null>>
>

export function parseNumericOnboardingStep(currentStep?: string): number

export function onboardingStep(campaign: Campaign | null, step: number): string

export function doPostAuthRedirect(existingCampaign?: Campaign | null): Promise<string | false | undefined>

export function updateUserMeta(
  meta: Partial<Record<string, string | number | boolean | object | null>>
): Promise<Partial<Record<string, string | number | boolean | object | null>> | false>
