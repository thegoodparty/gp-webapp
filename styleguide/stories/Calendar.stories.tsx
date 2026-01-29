import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { addDays, subDays } from 'date-fns'

import { Calendar } from '../components/ui/calendar'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    showOutsideDays: true,
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    mode: 'single',
  },
}

export const WithSelectedDate: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return <Calendar {...args} selected={date} onSelect={setDate} />
  },
  args: {
    mode: 'single',
  },
}

export const RangeSelection: Story = {
  render: (args) => {
    const today = new Date()
    const [range, setRange] = React.useState<
      { from?: Date; to?: Date } | undefined
    >({
      from: subDays(today, 3),
      to: addDays(today, 3),
    })
    return (
      <Calendar
        {...args}
        selected={range}
        onSelect={setRange}
        mode="range"
        numberOfMonths={2}
      />
    )
  },
}

export const DisabledDays: Story = {
  args: {
    mode: 'single',
    disabled: [{ dayOfWeek: [0, 6] }],
  },
}

export const WithoutOutsideDays: Story = {
  args: {
    mode: 'single',
    showOutsideDays: false,
  },
}

export const DropdownCaption: Story = {
  render: (args) => {
    return (
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Calendar {...args} />
      </div>
    )
  },
  args: {
    mode: 'single',
    captionLayout: 'dropdown',
  },
}

export const MultipleMonths: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 2,
  },
}
