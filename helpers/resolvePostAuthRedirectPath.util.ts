export interface CampaignStatus {
  status: string | boolean
  slug?: string
  step?: number
}

export const resolvePostAuthRedirectPath = (
  user: { roles?: string[] } | null,
  campaignStatus: CampaignStatus | null,
): string => {
  if (user?.roles?.includes('sales')) {
    return '/sales/add-campaign'
  }
  if (campaignStatus?.status === 'candidate') {
    return '/dashboard'
  }
  if (campaignStatus?.status === 'onboarding' && campaignStatus?.slug) {
    return `/onboarding/${campaignStatus.slug}/${campaignStatus.step ?? 1}`
  }
  if (!campaignStatus || campaignStatus.status === false) {
    return '/onboarding/office-selection'
  }
  return '/dashboard/profile'
}
