'use client'

import DomainSearch from './DomainSearch'
import { useWebsite } from '../../components/WebsiteProvider'
import MaxWidth from '@shared/layouts/MaxWidth'
import { Button } from '@styleguide'
import Link from 'next/link'

interface SelectDomainProps {
  onRegisterSuccess?: () => void
}

export default function SelectDomain({
  onRegisterSuccess: _onRegisterSuccess,
}: SelectDomainProps): React.JSX.Element {
  const { website } = useWebsite()
  const vanityPath = website?.vanityPath || ''

  return (
    <div className="space-y-4">
      <Button asChild variant="outline" className="mt-4 ml-4">
        <Link href="/dashboard/website">Exit</Link>
      </Button>

      <MaxWidth>
        <DomainSearch prefillSearch={vanityPath + '.com'} />
      </MaxWidth>
    </div>
  )
}
