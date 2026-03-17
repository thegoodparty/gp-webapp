'use client'

import React, { useState } from 'react'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { clientRequest } from 'gpApi/typed-request'
import { Organization } from 'gpApi/api-endpoints'
import DistrictPicker from 'app/onboarding/[slug]/[step]/components/districts/DistrictPicker'
import Button from '@shared/buttons/Button'

const AdminOrganizationsPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('')
  const [results, setResults] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!email.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const resp = await clientRequest('GET /v1/organizations/admin/list', {
        filter: email.trim(),
      })
      setResults(resp.data.organizations)
    } catch (e) {
      console.error('Failed to search organizations:', e)
      setResults([])
    }
    setLoading(false)
  }

  const handleDistrictSubmit = async (
    org: Organization,
    _type: { L2DistrictType: string } | null,
    name: { L2DistrictName: string; id?: string } | null,
  ) => {
    if (!name?.id) return
    await clientRequest('PATCH /v1/organizations/:slug', {
      slug: org.slug,
      overrideDistrictId: name.id,
    })
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
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2"
          />
          <Button onClick={handleSearch} disabled={loading || !email.trim()}>
            Search
          </Button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && searched && results.length === 0 && (
          <p className="text-gray-500">No organizations found.</p>
        )}

        {results.map((org) => (
          <div
            key={org.slug}
            className="border rounded-lg p-4 mb-4 bg-white"
          >
            <div className="mb-3">
              <p className="font-bold">{org.name || org.slug}</p>
              <p className="text-sm text-gray-400">Slug: {org.slug}</p>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm font-medium mb-2">Override District</p>
              <DistrictPicker
                state=""
                electionYear={new Date().getFullYear()}
                buttonText="Save District Override"
                onSubmit={(type, name) =>
                  handleDistrictSubmit(org, type, name)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </AdminWrapper>
  )
}

export default AdminOrganizationsPage
