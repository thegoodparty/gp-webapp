import { buttonVariants } from '@styleguide/components/ui/button'
import {
  HUBSPOT_DOMAIN_TRANSFER_FORM_URL,
  WEBSITE_SUNSET_NOTICE_ENABLED,
} from './websiteSunset'

interface WebsiteSunsetBannerProps {
  hasWebsite: boolean
}

// Persistent (non-dismissible) counterpart to WebsiteSunsetModal. The modal
// shows once on the dashboard; this banner gives candidates a permanent path
// back to the domain-transfer form from Settings (ENG-10304). Same eligibility
// as the modal: a candidate with a website while the notice is enabled.
export function WebsiteSunsetBanner({
  hasWebsite,
}: WebsiteSunsetBannerProps): React.JSX.Element | null {
  if (!hasWebsite || !WEBSITE_SUNSET_NOTICE_ENABLED) {
    return null
  }

  return (
    <div
      role="alert"
      className="mb-4 flex items-center gap-3 rounded-lg border border-neutral-400 bg-card px-4 py-3 text-card-foreground"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">Website discontinued</p>
        <p className="text-sm">
          Please transfer your domain to a provider of your choice.
        </p>
      </div>
      <a
        href={HUBSPOT_DOMAIN_TRANSFER_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: 'outline', size: 'xSmall' })}
      >
        Transfer
      </a>
    </div>
  )
}
