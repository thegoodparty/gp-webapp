import { useState } from 'react'
import RadioList from './RadioList'

export default {
  title: 'Inputs/RadioList',
  component: RadioList,
  tags: ['autodocs'],
  args: {
    options: [
      { key: '1', label: 'Option One' },
      { key: '2', label: 'Option Two' },
      { key: '3', label: 'Option Three' },
    ],
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState()

    return <RadioList {...args} selected={value} selectCallback={setValue} />
  },
}

export const Default = {}
