import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScrollArea } from '../components/ui/scroll-area'

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ScrollArea>

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-40 w-48 rounded-md border p-4">
      <div className="space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="h-8 rounded bg-muted p-2">
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
