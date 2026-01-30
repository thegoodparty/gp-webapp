'use client'
import TextField from '@shared/inputs/TextField'
import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon'
import React, { ChangeEvent } from 'react'

// FEC Committee IDs are "C" followed by exactly 8 digits (e.g., C00123456)
const FEC_PATTERN_PARTIAL = /^C\d{0,8}$/
const FEC_PATTERN_FULL = /^C\d{8}$/

export const isValidFecCommitteeId = (value: string): boolean =>
  FEC_PATTERN_FULL.test(value)

// Returns null when incomplete (show info icon), true/false when complete
export const getFecCommitteeIdValidation = (value: string): boolean | null => {
  if (!value || value.length < 9) return null
  return FEC_PATTERN_FULL.test(value)
}

const FEC_HELP_MESSAGE = (
  <span>
    Your FEC Committee ID can be found on the FEC website.
    <br />
    <br />
    It starts with &quot;C&quot; followed by 8 digits (e.g., C00123456).
  </span>
)

interface FecCommitteeIdInputProps {
  value?: string
  validated?: boolean | null
  onChange?: (val: string) => void
}

export const FecCommitteeIdInput = ({
  value = '',
  validated,
  onChange = () => { },
}: FecCommitteeIdInputProps): React.JSX.Element => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newVal = e.currentTarget.value.toUpperCase()

    // Only allow valid partial patterns (C followed by up to 8 digits)
    if (newVal !== '' && !FEC_PATTERN_PARTIAL.test(newVal)) {
      return
    }

    // Auto-prepend C if user starts typing digits
    if (newVal.length === 1 && /^\d$/.test(newVal)) {
      newVal = `C${newVal}`
    }

    onChange(newVal)
  }

  return (
    <TextField
      label="FEC Committee ID"
      placeholder="C00123456"
      value={value}
      onChange={handleOnChange}
      maxLength={9}
      InputProps={{
        endAdornment: (
          <AsyncValidationIcon message={FEC_HELP_MESSAGE} validated={validated} />
        ),
      }}
      fullWidth
      required
    />
  )
}
