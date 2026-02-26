import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import TaskCheckbox from '../../../app/(candidate)/dashboard/components/tasks/TaskCheckbox'

const meta: Meta<typeof TaskCheckbox> = {
  title: 'Campaign Plan/TaskCheckbox',
  component: TaskCheckbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof TaskCheckbox>

export const Unchecked: Story = {}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <TaskCheckbox {...args} checked={checked} onCheckedChange={setChecked} />
  },
}
