'use client'
import { noop } from '@shared/utils/noop'
import TextField from '@shared/inputs/TextField'
import { AsyncValidationIcon } from 'app/dashboard/shared/AsyncValidationIcon'
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
  helperText?: React.ReactNode
  name?: string
  error?: boolean
  // Fired when the help tooltip opens. Defaults to the committee-check
  // (Phase 1) event so that flow is unchanged; other flows (e.g. the
  // pro-upgrade EIN step) inject their own so the hover lands in the right
  // analytics funnel instead of CommitteeCheck's.
  onTooltipOpen?: () => void
}

export const EinCheckInput = ({
  value = '',
  validated,
  setValidated = noop,
  onChange = noop,
  onTooltipOpen = () =>
    trackEvent(EVENTS.ProUpgrade.CommitteeCheck.HoverEinHelp),
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
      label="Campaign EIN"
      value={value}
      onChange={handleOnChange}
      maxLength={10}
      InputProps={{
        endAdornment: (
          <AsyncValidationIcon
            message={EIN_HELP_MESSAGE}
            validated={validated}
            onTooltipOpen={onTooltipOpen}
          />
        ),
      }}
      fullWidth
      {...restProps}
    />
  )
}
