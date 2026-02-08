'use client'

import DomainSearch from './DomainSearch'
import { useWebsite } from '../../components/WebsiteProvider'
import MaxWidth from '@shared/layouts/MaxWidth'
import Button from '@shared/buttons/Button'

interface SelectDomainProps {
  onRegisterSuccess?: () => void
}

export default function SelectDomain({ onRegisterSuccess: _onRegisterSuccess }: SelectDomainProps): React.JSX.Element {
  const { website } = useWebsite()
  const vanityPath = website?.vanityPath || ''

  return (
    <div className="space-y-4">
      <Button
        color="neutral"
        variant="outlined"
        className="mt-4 ml-4"
        href="/dashboard/website"
      >
        Exit
      </Button>

      <MaxWidth>
        <DomainSearch prefillSearch={vanityPath + '.com'} />
      </MaxWidth>
    </div>
  )
}
