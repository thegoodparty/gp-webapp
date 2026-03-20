'use client'

import React from 'react'
import Link from 'next/link'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { clientRequest } from 'gpApi/typed-request'
import { AdminOrganization } from 'gpApi/api-endpoints'
import { useQuery } from '@tanstack/react-query'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import { useDebouncedValue } from '@shared/hooks/useDebouncedValue'

const OrgTypeLabel = ({ org }: { org: AdminOrganization }) => {
  if (org.electedOfficeId)
    return <span className="text-purple-600">Elected Office</span>
  if (org.campaignId) return <span className="text-blue-600">Campaign</span>
  return <span className="text-gray-400">Unknown</span>
}

export const AdminOrganizationsPage = (): React.JSX.Element => {
  const { on: enabled } = useFlagOn('win-serve-split')
  const [debouncedEmail, email, setEmail] = useDebouncedValue('', 300)

  const query = useQuery({
    queryKey: ['admin-list-organizations', debouncedEmail],
    queryFn: () =>
      clientRequest('GET /v1/organizations/admin/list', {
        email: debouncedEmail,
      }).then((res) => res.data.organizations),
    enabled: debouncedEmail.length > 0,
  })

  if (!enabled) {
    return <div>Feature flag not enabled</div>
  }

  return (
    <AdminWrapper pathname="/admin/organizations" title="Organizations">
      <div className="max-w-4xl">
        <div className="flex gap-3 mb-8">
          <input
            type="email"
            placeholder="Search by user email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2"
          />
        </div>

        {query.status === 'pending' && email.trim() && <p>Loading...</p>}

        {query.status === 'success' && query.data.length === 0 && (
          <p className="text-gray-500">No organizations found.</p>
        )}

        {query.status === 'success' &&
          query.data.map((org) => (
            <Link
              key={org.slug}
              href={`/admin/organizations/${org.slug}`}
              className="block w-full text-left border border-gray-200 rounded-lg p-4 mb-2 bg-white hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{org.name || org.slug}</p>
                  <p className="text-sm text-gray-400">{org.slug}</p>
                </div>
                <div className="text-right text-sm">
                  <OrgTypeLabel org={org} />
                  <p className="text-gray-400">{org.extra.owner.email}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </AdminWrapper>
  )
}
