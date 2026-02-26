import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import TaskItem from '../../../app/(candidate)/dashboard/campaign-plan/components/TaskItem'

const meta: Meta<typeof TaskItem> = {
  title: 'Campaign Plan/TaskItem',
  component: TaskItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Borough Council Meeting',
    description: 'Opportunity to address community concerns and observe local governance',
    date: 'Sep 7',
    type: 'Event',
  },
  decorators: [
    (Story) => (
      <div className="w-[343px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TaskItem>

export const Default: Story = {}

export const WithClick: Story = {
  args: {
    onClick: () => {},
  },
}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Locked: Story = {
  args: {
    locked: true,
  },
}

export const WithDateObject: Story = {
  args: {
    date: new Date('2025-09-07'),
  },
}

export const LongText: Story = {
  args: {
    title:
      'This is a very long task title that should be truncated with an ellipsis when it overflows',
    description:
      'This description is also very long and should be clipped to a single line on all screen sizes',
    date: 'Sep 10',
    type: 'Robocall',
  },
}

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <TaskItem {...args} checked={checked} onCheckedChange={setChecked} />
  },
  args: {
    title: 'Schedule introduction text message',
    description: 'Target cell phones with a text message.',
    date: 'Sep 10',
    type: 'Text',
    onClick: () => {},
  },
}
