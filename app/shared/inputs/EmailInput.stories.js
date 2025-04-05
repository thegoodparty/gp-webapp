import EmailInput from './EmailInput'
import { useState } from 'react'

export default {
  title: 'Inputs/EmailInput',
  component: EmailInput,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter your email',
    newCallbackSignature: true,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState()

    return (
      <div class="flex flex-col gap-3 items-start">
        <p>Default</p>
        <EmailInput {...args} value={value} onChangeCallback={setValue} />
        <p>Shrink Label</p>
        <EmailInput
          {...args}
          shrink
          value={value}
          onChangeCallback={setValue}
        />
        <p>Required</p>
        <EmailInput
          {...args}
          required
          value={value}
          onChangeCallback={setValue}
        />
        <p>No Label</p>
        <EmailInput
          {...args}
          useLabel={false}
          value={value}
          onChangeCallback={setValue}
        />
      </div>
    )
  },
}

export const Default = {}
