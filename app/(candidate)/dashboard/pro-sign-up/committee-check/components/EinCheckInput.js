'use client'
import TextField from '@shared/inputs/TextField'
import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import React from 'react'
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

export const EinCheckInput = ({
  value = '',
  validated,
  setValidated = () => {},
  onChange = () => {},
  ...restProps
}) => {
  const handleOnChange = async (e) => {
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
      maxLength={10}
      value={value}
      onChange={handleOnChange}
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
