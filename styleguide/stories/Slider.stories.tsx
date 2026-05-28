import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Slider } from '../components/ui/slider'

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: { type: 'number' },
      description: 'Minimum allowed value.',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum allowed value.',
    },
    step: {
      control: { type: 'number', min: 1 },
      description: 'Stepping interval.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the slider so the thumb cannot be moved.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Slider>

export const Playground: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
  render: (args) => (
    <div className="w-80">
      <Slider {...args} defaultValue={[50]} />
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[33]} />
    </div>
  ),
}

export const Range: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[25, 75]} />
    </div>
  ),
}

export const Stepped: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[40]} step={10} />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[50]} disabled />
    </div>
  ),
}
