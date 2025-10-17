'use client'
import React, { useState, useEffect } from 'react'
import Button from '@shared/buttons/Button'
import DistrictTypeAutocomplete from './DistrictTypeAutocomplete'
import DistrictNameAutocomplete from './DistrictNameAutocomplete'

export default function DistrictPicker({
  state,
  electionYear,        // number, derived from electionDate
  buttonText = 'Save',
  onSubmit = async () => Promise.resolve(),
  className = '',
  initialType = null,
  initialName = null,
  excludeInvalidOverride = false,
}) {
  const [type, setType]   = useState(initialType)
  const [name, setName]   = useState(initialName)
  const [busy, setBusy]   = useState(false)

  useEffect(() => {
    setType(initialType || null)
  }, [initialType])

  useEffect(() => {
    setName(initialName || null)
  }, [initialName])

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
        excludeInvalidOverride={excludeInvalidOverride}
      />

      <DistrictNameAutocomplete
        value={name}
        onChange={setName}
        districtType={type?.L2DistrictType}
        state={state}
        electionYear={electionYear}
        disabled={!type}
        excludeInvalidOverride={excludeInvalidOverride}
      />

      <div className="flex justify-end lg:col-span-2">
        <Button onClick={handleClick} disabled={!canSubmit} loading={busy}>
          <strong>{buttonText}</strong>
        </Button>
      </div>
    </div>
  )
}
