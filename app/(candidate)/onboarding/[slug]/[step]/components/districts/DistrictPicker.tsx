'use client'
import React, { useState, useEffect } from 'react'
import Button from '@shared/buttons/Button'
import DistrictTypeAutocomplete from './DistrictTypeAutocomplete'
import DistrictNameAutocomplete from './DistrictNameAutocomplete'

interface DistrictType {
  L2DistrictType: string
  id?: string
  label?: string
}

interface DistrictName {
  L2DistrictName: string
  id?: string
}

interface DistrictPickerProps {
  state: string
  electionYear: number
  buttonText?: string
  onSubmit?: (
    type: DistrictType | null,
    name: DistrictName | null,
  ) => Promise<void>
  className?: string
  initialType?: DistrictType | null
  initialName?: DistrictName | null
  excludeInvalidOverride?: boolean
}

export default function DistrictPicker({
  state,
  electionYear,
  buttonText = 'Save',
  onSubmit = async () => Promise.resolve(),
  className = '',
  initialType = null,
  initialName = null,
  excludeInvalidOverride = false,
}: DistrictPickerProps): React.JSX.Element {
  const [type, setType] = useState<DistrictType | null>(initialType)
  const [name, setName] = useState<DistrictName | null>(initialName)
  const [busy, setBusy] = useState(false)

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
        onChange={(v: DistrictType | null) => {
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
