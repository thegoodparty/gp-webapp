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
  /*
   * Optional props used to pre-populate the picker when a campaign already has a
   * district saved (e.g. in the admin Victory Path page). They should be the
   * full option objects returned by the autocomplete endpoints when possible –
   * at minimum they must contain `L2DistrictType` and `id` (for type) or
   * `L2DistrictName` and `id` (for name).
   */
  initialType = null,
  initialName = null,
}) {
  // Preserve the initial values if provided so the inputs are pre-filled when
  // the component mounts.
  const [type, setType]   = useState(initialType)
  const [name, setName]   = useState(initialName)
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
