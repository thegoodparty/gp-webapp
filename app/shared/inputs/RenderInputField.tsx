'use client'
import TextField from '@shared/inputs/TextField'
import EmailInput from '@shared/inputs/EmailInput'
import PhoneInput from '@shared/inputs/PhoneInput'
import Select from '@mui/material/Select'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@shared/inputs/RadioGroup'
import Checkbox from '@shared/inputs/Checkbox'
import { ClearRounded } from '@mui/icons-material'

interface RadioOption {
  key: string
  label: string
  value: string
}

export interface FieldConfig {
  key: string
  label?: string
  type: string
  cols?: number
  rows?: number
  placeholder?: string
  required?: boolean
  maxLength?: number
  noPastDates?: boolean
  dataAttributes?: Record<string, string>
  helperText?: string
  disabled?: boolean
  showResetButton?: boolean
  noBottomMargin?: boolean
  invalidOptions?: string[]
  defaultValue?: string
  options?: RadioOption[] | string[]
  alignLeft?: boolean
  groupLabel?: string
}

interface RenderInputFieldProps {
  field: FieldConfig
  value: string | boolean
  onChangeCallback: (
    key: string,
    value: string | boolean,
    invalidOptions?: string[],
  ) => void
  error?: boolean
}

const RenderInputField = ({
  field,
  value,
  onChangeCallback,
  error,
}: RenderInputFieldProps): React.JSX.Element => {
  const endAdornments: (React.ReactElement | 'error')[] = []
  if (field.showResetButton && value) {
    endAdornments.push(
      <ClearRounded
        key="clear"
        titleAccess="Clear input"
        className="cursor-pointer hover:text-black"
        onClick={() => onChangeCallback(field.key, '')}
      />,
    )
  }

  return (
    <div
      className={`col-span-12 ${field.cols === 6 && 'lg:col-span-6'} ${
        !field.noBottomMargin && 'mb-6'
      }`}
      key={field.key}
    >
      {(field.type === 'text' ||
        field.type === 'date' ||
        field.type === 'number') && (
        <TextField
          endAdornments={endAdornments}
          label={field.label}
          name={field.label}
          fullWidth
          value={value as string}
          placeholder={field.placeholder || ''}
          onChange={(e) =>
            onChangeCallback(field.key, e.target.value, field.invalidOptions)
          }
          multiline={!!field.rows}
          rows={field.rows || 1}
          required={field.required}
          type={field.type}
          error={error}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            ...(field.maxLength ? { maxLength: field.maxLength } : {}),
            ...(field.type === 'date' && field.noPastDates
              ? {
                  min: new Date().toISOString().split('T')[0],
                }
              : {}),
            ...(field.dataAttributes || {}),
          }}
          helperText={field.helperText}
          disabled={field.disabled}
        />
      )}
      {field.type === 'email' && (
        <EmailInput
          value={value as string}
          onChangeCallback={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeCallback(field.key, e.target.value)
          }
          variant="outlined"
          shrink
          disabled={field.disabled}
          placeholder={field.placeholder || ''}
          required={field.required}
        />
      )}
      {field.type === 'phone' && (
        <PhoneInput
          value={value as string}
          required={field.required}
          onChangeCallback={(phone) => {
            onChangeCallback(field.key, phone)
          }}
          hideIcon
          shrink
          disabled={field.disabled}
          placeholder={field.placeholder || ''}
        />
      )}

      {field.type === 'radio' && (
        <div className={`mb-4 ${field.alignLeft ? 'ml-2' : 'items-center'}`}>
          <div className="mb-1">
            {field.label}
            {field.label && field.required && <sup> *</sup>}
          </div>
          <RadioGroup
            className="flex flex-col justify-start"
            name={field.label}
            defaultValue={field.defaultValue}
            onChange={(e) => {
              onChangeCallback(field.key, e.target.value)
            }}
          >
            {field.options &&
              (field.options as RadioOption[]).map(({ key, label, value }) => (
                <FormControlLabel
                  key={key}
                  {...{
                    value: value,
                    label,
                    control: <Radio className="flex-block" />,
                  }}
                />
              ))}
          </RadioGroup>
        </div>
      )}
      {field.type === 'select' && (
        <>
          <div className="text-sm text-gray-500">
            {field.label}
            {field.required && <sup> *</sup>}
          </div>
          <Select
            native
            value={value}
            fullWidth
            variant="outlined"
            onChange={(e) =>
              onChangeCallback(field.key, e.target.value, field.invalidOptions)
            }
            label={field.label}
            error={error}
            disabled={field.disabled}
            inputProps={{
              ...(field.dataAttributes || {}),
            }}
          >
            <option value="">Select</option>
            {(field.options as string[]).map((op) => (
              <option value={op} key={op}>
                {op}
              </option>
            ))}
          </Select>
        </>
      )}
      {field.type === 'checkbox' && (
        <div>
          {field.groupLabel && (
            <div className="font-bold mb-3">{field.groupLabel}</div>
          )}
          <div className="flex items-center">
            <Checkbox
              value={value as boolean}
              onChange={(e) => onChangeCallback(field.key, e.target.checked)}
              disabled={field.disabled}
            />
            <div className="ml-1 ">{field.label}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RenderInputField
