import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AspectRatio } from '../components/ui/aspect-ratio'

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/Aspect Ratio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: { type: 'number', min: 0.25, max: 4, step: 0.05 },
      description: 'Width-to-height ratio. 16/9 ≈ 1.78, 4/3 ≈ 1.33, 1/1 = 1.',
    },
  },
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Playground: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-96">
      <AspectRatio {...args} className="bg-muted rounded-md">
        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
          {args.ratio?.toFixed(2)}
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-64">
      <AspectRatio ratio={1} className="bg-muted rounded-md">
        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
          1 : 1
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Video: Story = {
  render: () => (
    <div className="w-96">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Portrait: Story = {
  render: () => (
    <div className="w-64">
      <AspectRatio ratio={3 / 4} className="bg-muted rounded-md">
        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
          3 : 4
        </div>
      </AspectRatio>
    </div>
  ),
}
