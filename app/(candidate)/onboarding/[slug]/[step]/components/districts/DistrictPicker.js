'use client'
import React, { useState } from 'react'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import DistrictTypeAutocomplete from './DistrictTypeAutocomplete'
import DistrictNameAutocomplete from './DistrictNameAutocomplete'

export default function DistrictPicker({
  state,
  electionYear,        // number, derived from electionDate
  buttonText = 'Save',
  onSubmit,
  className = '',
}) {
  const [type, setType]   = useState(null)
  const [name, setName]   = useState(null)
  const [busy, setBusy]   = useState(false)

  const canSubmit = !!type && !!name && !busy

  const handleClick = async () => {
    if (!canSubmit) return
    setBusy(true)
    try {
      await onSubmit(type, name)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`${className}`}>
      <DistrictTypeAutocomplete
        value={type}
        onChange={(v) => {
          setType(v)
          setName(null)
        }}
        state={state}
        electionYear={electionYear}
      />

      <DistrictNameAutocomplete
        value={name}
        onChange={setName}
        districtType={type?.L2DistrictType}
        state={state}
        electionYear={electionYear}
        disabled={!type}
      />

      <div className="flex justify-end lg:col-span-2">
        <BlackButtonClient onClick={handleClick} disabled={!canSubmit}>
          <strong>{busy ? 'Saving…' : buttonText}</strong>
        </BlackButtonClient>
      </div>
    </div>
  )
}
