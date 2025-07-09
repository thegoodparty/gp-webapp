'use client'
import React, { useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch' // Different fetch helper?
import H2 from '@shared/typography/H2'
import TextField from '@shared/inputs/TextField'
import PortalPanel from '@shared/layouts/PortalPanel'
import { Autocomplete } from '@mui/material'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import { apiRoutes } from 'gpApi/routes'
import { useRouter } from 'next/navigation'

async function updateDistrict(L2DistrictType, L2DistrictName, slug) {
  try {
    const resp = await clientFetch(apiRoutes.campaign.district, {
      slug,
      L2DistrictType,
      L2DistrictName
    })

    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function DistrictStep({ campaign, step, adminMode, ...props }) {
  const router = useRouter()
  const [districtTypes, setDistrictTypes] = useState([])
  const [districtNames, setDistrictNames] = useState([])
  const [selectedDistrictType, setselectedDistrictType] = useState(null)
  const [selectedDistrictName, setselectedDistrictName] = useState(null)
  const [loadingDistrictTypes, setloadingDistrictTypes] = useState(false)
  const [loadingDistrictNames, setloadingDistrictNames] = useState(false)
  const [ processing, setProcessing] = useState(false)
  
  const electionYear = new Date(campaign.details.electionDate).getFullYear()
  const { state } = campaign.details

  useEffect(() => {
    (async () => {
      setloadingDistrictTypes(true)
      const { data = [] } = await clientFetch(
        apiRoutes.elections.districts.types,
        { state, electionYear },
      )
      setDistrictTypes(data.map(d => ({
        ...d,
        label: d.L2DistrictType.replace(/_/g, ' ')
      })))
      setloadingDistrictTypes(false)
    }) ()
}, [state, electionYear])

  useEffect(() => {
    if (!selectedDistrictType) {
      setDistrictNames([])
      return
    }
    
    (async () => {
      setloadingDistrictNames(true)
      const { data = [] } = await clientFetch(
        apiRoutes.elections.districts.names,
        {
          L2DistrictType: selectedDistrictType.L2DistrictType,
          electionYear,
          state,
        }
      )
      setDistrictNames(data)
      setloadingDistrictNames(false)
    }) ()
  }, [selectedDistrictType, electionYear, state])

  const canSubmit = !!selectedDistrictType && !!selectedDistrictName

  const handleContinue = async () => {
    if (!canSubmit || processing) return
    setProcessing(true)
    try {
      if (adminMode) {
        await updateDistrict(
          selectedDistrictType.L2DistrictType, 
          selectedDistrictName.L2DistrictName, 
          campaign.slug
        )
      } else {
        await updateDistrict(
          selectedDistrictType.L2DistrictType, 
          selectedDistrictName.L2DistrictName
        )
      }
      router.push(`/onboarding/${campaign.slug}/${step + 1}`)
    } catch(err) {
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <PortalPanel color="#2CCDB0" {...props}>
      <div className="mt-8">
        <H2 className="mb-8">Select Your District</H2>

        <div className="max-w-4xl mx-auto mx-auto grid lg:grid-cols-2 gap-6">
          {/* -------- District Type -------- */}
          <div className="col-span-12 lg:col-span-6">
            <Autocomplete
              fullWidth
              loading={loadingDistrictTypes}
              options={districtTypes}
              value={selectedDistrictType}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(o, v) => o.id === v?.id}
              onChange={(_, v) => {
                setselectedDistrictType(v)
                setselectedDistrictName(null)
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
          {selectedDistrictType && (
            <div className="col-span-12 lg:col-span-6">
              <Autocomplete
                loading={loadingDistrictNames}
                options={districtNames}
                value={selectedDistrictName}
                getOptionLabel={(o) => o.L2DistrictName}
                onChange={(_, v) => setselectedDistrictName(v)}
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
            disabled={!canSubmit || processing}
          >
            <strong>Continue</strong>
          </BlackButtonClient>
        </div>
      </div>
    </PortalPanel>
  )
}