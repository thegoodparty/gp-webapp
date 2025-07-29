'use client'
import React, { useState } from 'react'
import Button from '@shared/buttons/Button'
import DistrictTypeAutocomplete from './DistrictTypeAutocomplete'
import DistrictNameAutocomplete from './DistrictNameAutocomplete'

export default function DistrictPicker({
  state,
  electionYear,        // number, derived from electionDate
  buttonText = 'Save',
  onSubmit = async () => Promise.resolve(),
  className = '',
}) {
  const [type, setType]   = useState(null)
  const [name, setName]   = useState(null)
  const [busy, setBusy]   = useState(false)

  const canSubmit = !!type && !!name && !busy

  const handleClick = async () => {
    if (!canSubmit) return
    setBusy(true)
    await onSubmit(type, name)
    setBusy(false)
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
        <Button onClick={handleClick} disabled={!canSubmit} loading={busy}>
          <strong>{buttonText}</strong>
        </Button>
      </div>
    </div>
  )
}
