import TextField, { TextFieldProps } from '@shared/inputs/TextField'
import React from 'react'

const digitsOnlyRegex = /^\d+$/
const getDigitsOnlyWithMaxLengthRegex = (maxLength: number): RegExp =>
  new RegExp(`^\\d{1,${maxLength}}$`)

type NumbersOnlyTextFieldProps = Omit<
  TextFieldProps<'standard'>,
  'value' | 'onChange'
> & {
  value: string
  onChange: (e: { target: { value: string } }) => void
  maxLength?: number
}

export const NumbersOnlyTextField = ({
  value,
  onChange,
  maxLength,
  ...props
}: NumbersOnlyTextFieldProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value
    const regex = maxLength
      ? getDigitsOnlyWithMaxLengthRegex(maxLength)
      : digitsOnlyRegex
    return newValue !== '' && !regex.test(newValue)
      ? onChange({ target: { value: value } })
      : onChange({ target: { value: newValue } })
  }
  return (
    <TextField
      {...{
        value,
        onChange: handleOnChange,
        ...props,
      }}
    />
  )
}
