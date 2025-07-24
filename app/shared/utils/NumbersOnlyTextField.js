import TextField from '@shared/inputs/TextField'

const digitsOnlyRegex = /^\d+$/
const getDigitsOnlyWithMaxLengthRegex = (maxLength) =>
  new RegExp(`^\\d{1,${maxLength}}$`)

export const NumbersOnlyTextField = ({
  value,
  onChange,
  maxLength,
  ...props
}) => {
  const handleOnChange = (e) => {
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
