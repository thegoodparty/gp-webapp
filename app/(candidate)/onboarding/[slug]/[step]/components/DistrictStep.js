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
  const [selectedType, setSelectedType] = useState(null)
  const [selectedName, setSelectedName] = useState(null)
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [loadingNames, setLoadingNames] = useState(false)
  
  const electionYear = new Date(campaign.details.electionDate).getFullYear()
  const { state } = campaign.details

  useEffect(() => {
    (async () => {
      setLoadingTypes(true)
      const { data = [] } = await clientFetch(
        apiRoutes.elections.districts.types,
        { state, electionYear },
      )
      setDistrictTypes(data)
      setLoadingTypes(false)
    }) ()
}, [state, electionYear])

  useEffect(() => {
    if (!selectedType) {
      setDistrictNames([])
      return
    }
    
    (async () => {
      setLoadingNames(true)
      const { data = [] } = await clientFetch(
        apiRoutes.elections.districts.names,
        {
          L2DistrictType: selectedType.L2DistrictType,
          electionYear,
          state,
        }
      )
      setDistrictNames(data)
      setLoadingNames(false)
    }) ()
  }, [selectedType, electionYear, state])

  const handleContinue = () => {
    // Save to campaign, etc.
  }

  return (
    <PortalPanel color="#2CCDB0" {...props}>
      <div className="mt-8">
        <H2 className="mb-8">Pick Your District</H2>

        <div className="max-w-4xl mx-auto mx-auto grid lg:grid-cols-2 gap-6">
          {/* -------- District Type -------- */}
          <div className="col-span-12 lg:col-span-6">
            <Autocomplete
              fullWidth
              loading={loadingTypes}
              options={districtTypes}
              value={selectedType}
              getOptionLabel={(o) => o.L2DistrictType}
              isOptionEqualToValue={(o, v) => o.id === v?.id}
              onChange={(_, v) => {
                setSelectedType(v)
                setSelectedName(null)
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="District Type" 
                  required
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
                value={selectedName}
                getOptionLabel={(o) => o.L2DistrictName}
                onChange={(_, v) => setSelectedName(v)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="District Name" 
                    required
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