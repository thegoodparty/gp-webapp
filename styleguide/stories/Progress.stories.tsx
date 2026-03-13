import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Progress } from '../components/ui/progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Progress>

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

export const Indeterminate: Story = {
  render: () => <Progress />,
}

export const CustomColors: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Default</span>
          <span className="text-sm text-muted-foreground">33%</span>
        </div>
        <Progress value={33} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Success</span>
          <span className="text-sm text-muted-foreground">75%</span>
        </div>
        <Progress value={75} className="bg-green-100" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Warning</span>
          <span className="text-sm text-muted-foreground">50%</span>
        </div>
        <Progress value={50} className="bg-yellow-100" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Error</span>
          <span className="text-sm text-muted-foreground">90%</span>
        </div>
        <Progress value={90} className="bg-red-100" />
      </div>
    </div>
  ),
}

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="text-sm font-medium">Small</span>
        <Progress value={33} className="h-1" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-medium">Default</span>
        <Progress value={33} />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-medium">Large</span>
        <Progress value={33} className="h-4" />
      </div>
    </div>
  ),
}
