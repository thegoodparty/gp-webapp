import { useState } from 'react'
import PhoneInput from './PhoneInput'

export default {
  title: 'Inputs/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter phone number',
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState()

    return (
      <div class="flex flex-col gap-3 items-start">
        <p>Default</p>
        <PhoneInput {...args} value={value} onChangeCallback={setValue} />
        <p>Shrink Label</p>
        <PhoneInput
          {...args}
          shrink
          value={value}
          onChangeCallback={setValue}
        />
        <p>Required</p>
        <PhoneInput
          {...args}
          required
          value={value}
          onChangeCallback={setValue}
        />
        <p>No Label</p>
        <PhoneInput
          {...args}
          useLabel={false}
          value={value}
          onChangeCallback={setValue}
        />
        <p>No Icon</p>
        <PhoneInput
          {...args}
          hideIcon
          value={value}
          onChangeCallback={setValue}
        />
      </div>
    )
  },
}

export const Default = {}
