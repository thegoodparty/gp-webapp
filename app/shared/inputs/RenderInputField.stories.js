import { useState } from 'react'
import RenderInputField from './RenderInputField'

const textField = {
  type: 'text',
  label: 'Text Field',
  placeholder: 'Put some text here',
  helperText: 'Some helper text',
}

export default {
  title: 'Inputs/RenderInputField',
  component: RenderInputField,
  tags: ['autodocs'],
  args: {
    field: textField,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState()

    const handleChange = (_k, v) => setValue(v)

    return (
      <div className="flex flex-col gap-3 items-start">
        <p>Default</p>
        <RenderInputField
          value={value}
          onChangeCallback={handleChange}
          {...args}
        />
        <p>Required</p>
        <RenderInputField
          value={value}
          onChangeCallback={handleChange}
          {...{ ...args, field: { ...args?.field, required: true } }}
        />
        <p>Error</p>
        <RenderInputField
          value={value}
          onChangeCallback={handleChange}
          {...args}
          error
        />
        <p>Disabled</p>
        <RenderInputField
          value={value}
          onChangeCallback={handleChange}
          {...{ ...args, field: { ...args?.field, disabled: true } }}
        />
      </div>
    )
  },
}

export const Default = {}

export const Multiline = {
  args: {
    field: {
      ...textField,
      rows: 3,
    },
  },
}

export const Date = {
  args: {
    field: {
      type: 'date',
      label: 'Date Field',
      helperText: 'Some helper text',
    },
  },
}

export const Number = {
  args: {
    field: {
      type: 'number',
      label: 'Number Field',
      helperText: 'Some helper text',
      placeholder: 'Put number here',
    },
  },
}

export const Email = {
  args: {
    field: {
      type: 'email',
      label: 'Email Field',
      placeholder: 'Enter your email',
    },
  },
}

export const Phone = {
  args: {
    field: {
      type: 'phone',
      label: 'Phone Field',
      placeholder: 'Enter phone number',
    },
  },
}

export const Radio = {
  args: {
    field: {
      type: 'radio',
      label: 'Radio Field',
    },
  },
}

export const Checkbox = {
  args: {
    field: {
      type: 'checkbox',
      label: 'Checkbox Field',
    },
  },
}

export const Select = {
  args: {
    field: {
      type: 'select',
      label: 'Select Field',
      options: ['Option One', 'Option Two', 'Option Three'],
    },
  },
}
