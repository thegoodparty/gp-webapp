import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Skeleton } from '../components/ui/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-32" />,
}

export const WithAvatar: Story = {
  render: () => <Skeleton className="h-12 w-12 rounded-full" />,
}

export const WithCard: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Skeleton className="h-6 w-2/3 rounded" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  ),
}

export const WithParagraph: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ),
}

export const WithList: Story = {
  render: () => (
    <ul className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i}>
          <Skeleton className="h-4 w-1/2" />
        </li>
      ))}
    </ul>
  ),
}
