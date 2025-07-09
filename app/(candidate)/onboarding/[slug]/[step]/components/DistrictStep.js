'use client'
import React, { useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch' // Different fetch helper?
import H2 from '@shared/typography/H2'
import TextField from '@shared/inputs/TextField'
import PortalPanel from '@shared/layouts/PortalPanel'
import { Autocomplete } from '@mui/material'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import { apiRoutes } from 'gpApi/routes'

export default function DistrictStep({ campaign, step, ...props }) {
  const [districtTypes, setDistrictTypes] = useState([])
  const [districtNames, setDistrictNames] = useState([])
  const [selectedType, setSelectedType] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [loadingNames, setLoadingNames] = useState(false)
  
  const electionYear = new Date(campaign.details.electionDate).getFullYear()
  const { state } = campaign.details

  useEffect(() => {
    async function fetchTypes() {
      setLoadingTypes(true)
      const resp = await clientFetch(apiRoutes.elections.districts.types, {
        state,
        electionYear,
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
    <PortalPanel color="#2CCDB0" {...props}>
      <div className="mt-8">
        <H2 className="mb-8">Pick Your District</H2>

        <div className="max-w-4xl mx-auto">
          {/* -------- District Type -------- */}
          <div className="col-span-12 lg:col-span-6">
            <Autocomplete
              loading={loadingTypes}
              options={districtTypes}
              value={
                districtTypes.find((t) => t.id === selectedType) || null
              }
              getOptionLabel={(option) => option.L2DistrictType}
              onChange={(_, v) => {
                setSelectedType(v ? v.id : null)
                setSelectedName(null) // reset name when type changes
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  label="District Type"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    style: { borderRadius: '4px' },
                  }}
                />
              )}
            />
          </div>

          {/* -------- District Name -------- */}
          {selectedType && (
            <div className="col-span-12 lg:col-span-6">
              <Autocomplete
                loading={loadingNames}
                options={districtNames}
                value={
                  districtNames.find((n) => n.id === selectedName) || null
                }
                getOptionLabel={(option) => option.L2DistrictName}
                onChange={(_, v) => setSelectedName(v ? v.id : null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    label="District Name"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      style: { borderRadius: '4px' },
                    }}
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <BlackButtonClient
            onClick={handleContinue}
            disabled={!selectedType || !selectedName}
          >
            <strong>Continue</strong>
          </BlackButtonClient>
        </div>
      </div>
    </PortalPanel>
  )
}