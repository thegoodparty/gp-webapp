import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Progress } from '../components/ui/progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Fill percentage, 0–100.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Playground: Story = {
  args: {
    value: 33,
  },
  render: ({ value }) => <Progress value={value} />,
}

export const Default: Story = {
  render: () => <Progress value={33} />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-muted-foreground">33%</span>
      </div>
      <Progress value={33} />
    </div>
  ),
}
