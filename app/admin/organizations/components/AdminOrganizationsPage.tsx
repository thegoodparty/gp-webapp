'use client'

import React, { useState } from 'react'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { clientRequest } from 'gpApi/typed-request'
import { Organization } from 'gpApi/api-endpoints'
import DistrictPicker from 'app/onboarding/[slug]/[step]/components/districts/DistrictPicker'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'helpers/useSnackbar'

const AdminOrganizationsPage = (): React.JSX.Element => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [email, setEmail] = useState('')

  const { successSnackbar, errorSnackbar } = useSnackbar()

  const query = useQuery({
    queryKey: ['admin-list-organizations', email],
    queryFn: () =>
      clientRequest('GET /v1/organizations/admin/list', {
        filter: email.trim(),
      }).then((res) => res.data.organizations),
  })

  const updateDistrictMutation = useMutation({
    mutationFn: (params: { slug: string; overrideDistrictId: string }) =>
      clientRequest('PATCH /v1/organizations/:slug', params).then(
        (res) => res.data,
      ),
    onSuccess: () => {
      successSnackbar('District override saved')
    },
    onError: (error) => {
      errorSnackbar(error.message)
    },
  })

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

        {query.status === 'pending' && <p>Loading...</p>}

        {query.status === 'success' && query.data.length === 0 && (
          <p className="text-gray-500">No organizations found.</p>
        )}

        {query.status === 'success' &&
          query.data.map((org) => (
            <button
              key={org.slug}
              type="button"
              onClick={() => setSelectedOrg(org)}
              className={`w-full text-left border rounded-lg p-4 mb-2 bg-white cursor-pointer ${
                selectedOrg?.slug === org.slug
                  ? 'border-black ring-1 ring-black'
                  : 'border-gray-200'
              }`}
            >
              <p className="font-bold">{org.name || org.slug}</p>
              <p className="text-sm text-gray-400">Slug: {org.slug}</p>
            </button>
          ))}

        {selectedOrg && (
          <div className="border rounded-lg p-4 mt-4 bg-white">
            <p className="font-medium mb-3">
              Override District for{' '}
              <span className="font-bold">
                {selectedOrg.name || selectedOrg.slug}
              </span>
            </p>
            <DistrictPicker
              state=""
              electionYear={new Date().getFullYear()}
              buttonText="Save District Override"
              onSubmit={async (_type, name) => {
                updateDistrictMutation.mutate({
                  slug: selectedOrg.slug,
                  overrideDistrictId: name.id,
                })
              }}
            />
          </div>
        )}
      </div>
    </AdminWrapper>
  )
}

export default AdminOrganizationsPage
