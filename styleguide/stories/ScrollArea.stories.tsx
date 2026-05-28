import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScrollArea } from '../components/ui/scroll-area'

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['auto', 'always', 'scroll', 'hover'],
      description:
        'When the scrollbar is visible. auto: when content overflows. always: visible. scroll: while scrolling. hover: while hovering.',
    },
  },
}

export default meta

type Story = StoryObj<typeof ScrollArea>

type PlaygroundArgs = {
  type: 'auto' | 'always' | 'scroll' | 'hover'
  height: number
  itemCount: number
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    type: 'hover',
    height: 160,
    itemCount: 20,
  },
  argTypes: {
    height: { control: { type: 'number', min: 80, max: 400, step: 8 } },
    itemCount: { control: { type: 'number', min: 1, max: 100, step: 1 } },
  },
  render: ({ type, height, itemCount }) => (
    <ScrollArea
      type={type}
      className="w-48 rounded-md border p-4"
      style={{ height }}
    >
      <div className="space-y-4">
        {Array.from({ length: itemCount }, (_, i) => (
          <div key={i} className="h-8 rounded bg-muted p-2">
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

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
