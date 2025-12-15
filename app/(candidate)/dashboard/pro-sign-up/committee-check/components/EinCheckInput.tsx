'use client'
import TextField from '@shared/inputs/TextField'
import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import React, { ChangeEvent } from 'react'
import { EIN_PATTERN_PARTIAL } from '@shared/inputs/IsValidEIN'

const EIN_HELP_MESSAGE = (
  <span>
    A political organization must have its own employer identification number
    (EIN), even if it does not have any employees.
    <br />
    <br />
    This number is used to support the legitimacy of your campaign.
  </span>
)

interface EinCheckInputProps {
  value?: string
  validated?: boolean | null
  setValidated?: (val: boolean | null) => void
  onChange?: (val: string) => void
  name?: string
}

export const EinCheckInput = ({
  value = '',
  validated,
  setValidated = () => {},
  onChange = () => {},
  ...restProps
}: EinCheckInputProps): React.JSX.Element => {
  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.currentTarget.value

    if (validated !== null) {
      setValidated(null)
    }

    const maybeAddDash =
      newVal.length === 2 && value.length === 1 ? `${newVal}-` : newVal

    return newVal !== '' && !EIN_PATTERN_PARTIAL.test(newVal)
      ? onChange(value)
      : onChange(maybeAddDash)
  }

  return (
    <TextField
      className="mb-3"
      label="EIN Number"
      value={value}
      onChange={handleOnChange}
      maxLength={10}
      InputProps={{
        endAdornment: (
          <AsyncValidationIcon
            message={EIN_HELP_MESSAGE}
            validated={validated}
            onTooltipOpen={() => {
              trackEvent(EVENTS.ProUpgrade.CommitteeCheck.HoverEinHelp)
            }}
          />
        ),
      }}
      fullWidth
      {...restProps}
    />
  )
}
