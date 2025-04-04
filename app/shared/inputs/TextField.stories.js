import TextField from './TextField'
import { MdOutlineMailOutline } from 'react-icons/md'

export default {
  title: 'Inputs/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Text Field',
    placeholder: 'Input some text here',
  },
  render: (args) => (
    <div className="flex flex-col gap-3 items-start">
      <p>Default label</p>
      <TextField {...args} />
      <p>Shrink label</p>
      <TextField {...args} InputLabelProps={{ shrink: true }} />
    </div>
  ),
}

export const Default = {}
export const Error = {
  args: {
    error: true,
    endAdornments: ['error'],
    helperText: 'Something is wrong',
  },
}
export const CustomIcon = {
  args: {
    endAdornments: [<MdOutlineMailOutline key="1234" />],
  },
}
