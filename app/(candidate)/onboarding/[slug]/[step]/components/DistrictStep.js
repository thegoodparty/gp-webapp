'use client'
import React, { useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch' // Different fetch helper?
import Button from '@shared/buttons/Button'
import { apiRoutes } from 'gpApi/routes'

export default function DistrictStep({ campaign, step, ...props }) {
  const [districtTypes, setDistrictTypes] = useState([])
  const [districtNames, setDistrictNames] = useState([])
  const [selectedType, setSelectedType] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [loadingNames, setLoadingNames] = useState(false)

  useEffect(() => {
    async function fetchTypes() {
      setLoadingTypes(true)
      const resp = await clientFetch(apiRoutes.elections.districts.types, {
        state: campaign.details.state,
        electionYear: new Date(campaign.details.electionDate).getFullYear()
      })
      console.log('district types resp', resp)
      console.log('campaign looks like: ', campaign)
      setDistrictTypes(resp?.data || [])
      setLoadingTypes(false)
  }
  fetchTypes()
}, [])

  useEffect(() => {
    if (!selectedType) {
      setDistrictNames([])
      return
    }
    async function fetchNames() {
      setLoadingNames(true)
      const resp = await clientFetch(apiRoutes.elections.districts.names, {
        L2DistrictType: selectedType,
        electionYear,
        state,
        // Fix this
      })
      setDistrictNames(resp?.data || [])
      setLoadingNames(false)
    }
    fetchNames()
  }, [selectedType])

  const handleContinue = () => {
    // Save to campaign, etc.
  }

  return (
    <div>
      <h2>Pick Your District</h2>
      <div>
        <label>District Type:</label>
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          disabled={loadingTypes}
        >
          <option value="">Select type</option>
          {districtTypes.map(type => (
            <option key={type.id} value={type.id}>{type.L2DistrictType}</option>
          ))}
        </select>
      </div>
      {selectedType && (
        <div>
          <label>District Name:</label>
          <select
            value={selectedName}
            onChange={e => setSelectedName(e.target.value)}
            disabled={loadingNames}
          >
            <option value="">Select district</option>
            {districtNames.map(name => (
              <option key={name.id} value={name.id}>{name.L2DistrictName}</option>
            ))}
          </select>
        </div>
      )}
      <Button
        onClick={handleContinue}
        disabled={!selectedType || !selectedName}
      >
        Continue
      </Button>
    </div>
  )
}