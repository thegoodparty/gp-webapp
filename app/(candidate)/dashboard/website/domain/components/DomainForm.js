'use client'

import DomainSearch from './DomainSearch'
import CustomDomain from './CustomDomain'
import { useWebsite } from '../../components/WebsiteProvider'
import MaxWidth from '@shared/layouts/MaxWidth'
import Button from '@shared/buttons/Button'

export default function DomainForm({ onRegisterSuccess }) {
  const { website } = useWebsite()
  const { vanityPath, domain } = website

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
        {!!domain ? (
          <CustomDomain domain={domain} />
        ) : (
          <DomainSearch
            prefillSearch={vanityPath + '.com'}
            onRegisterSuccess={onRegisterSuccess}
          />
        )}
      </MaxWidth>
    </div>
  )
}
