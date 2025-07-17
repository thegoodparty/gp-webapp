'use client'

import DomainSearch from './DomainSearch'
import { useWebsite } from '../../components/WebsiteProvider'
import MaxWidth from '@shared/layouts/MaxWidth'
import ExitButton from './ExitButton'

export default function SelectDomain({ onRegisterSuccess }) {
  const { website } = useWebsite()
  const { vanityPath } = website

  return (
    <div className="space-y-4">
      <ExitButton />

      <MaxWidth>
        <DomainSearch
          prefillSearch={vanityPath + '.com'}
          onRegisterSuccess={onRegisterSuccess}
        />
      </MaxWidth>
    </div>
  )
}
