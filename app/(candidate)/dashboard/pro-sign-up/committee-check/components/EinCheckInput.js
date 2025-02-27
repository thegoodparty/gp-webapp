'use client';
import TextField from '@shared/inputs/TextField';
import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';
import React from 'react';

const EIN_PATTERN_PARTIAL = /^\d{1,2}-\d{0,7}$|^\d{2}$|^\d$/;
export const EIN_PATTERN_FULL = /^\d{2}-\d{7}$/;

const EIN_HELP_MESSAGE = (
  <span>
    A political organization must have its own employer identification number
    (EIN), even if it does not have any employees.
    <br />
    <br />
    This number is used to support the legitimacy of your campaign.
  </span>
);

export const EinCheckInput = ({
  loading = false,
  value = '',
  validated,
  setValidated,
  onChange = () => {},
  ...restProps
}) => {
  const handleOnChange = async (e) => {
    const newVal = e.currentTarget.value;

    if (validated !== null) {
      setValidated(null);
    }

    const maybeAddDash =
      newVal.length === 2 && value.length === 1 ? `${newVal}-` : newVal;

    return newVal !== '' && !EIN_PATTERN_PARTIAL.test(newVal)
      ? onChange(value)
      : onChange(maybeAddDash);
  };

  return (
    <TextField
      className="mb-3"
      label="EIN Number"
      maxLength={10}
      disabled={loading}
      value={value}
      onChange={handleOnChange}
      InputProps={{
        endAdornment: (
          <AsyncValidationIcon
            message={EIN_HELP_MESSAGE}
            loading={loading}
            validated={validated}
            onTooltipOpen={() => {
              trackEvent(EVENTS.ProUpgrade.CommitteeCheck.HoverEinHelp);
            }}
          />
        ),
      }}
      fullWidth
      {...restProps}
    />
  );
};
