import { useState } from 'react'
import PasswordInput from './PasswordInput'

export default {
  title: 'Inputs/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter new password',
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState()

    return (
      <PasswordInput {...args} value={value} onChangeCallback={setValue} />
    )
  },
}

export const Default = {}
