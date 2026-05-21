import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import { StarIcon } from '../components/ui/icons'
import { Toggle } from '../components/ui/toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      description: 'Visual variant.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the toggle.',
    },
    pressed: {
      control: 'boolean',
      description: 'Controlled pressed state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the toggle.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'default',
    pressed: false,
    disabled: false,
  },
  render: ({ pressed, disabled, variant, size }) => {
    const [, updateArgs] = useArgs()
    return (
      <Toggle
        pressed={pressed}
        disabled={disabled}
        variant={variant}
        size={size}
        onPressedChange={(next) => updateArgs({ pressed: next })}
        aria-label="Toggle favorite"
      >
        <StarIcon />
      </Toggle>
    )
  },
}

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle favorite">
      <StarIcon />
    </Toggle>
  ),
}

export const WithText: Story = {
  render: () => <Toggle aria-label="Toggle published">Published</Toggle>,
}

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle favorite">
      <StarIcon />
    </Toggle>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle size="sm" aria-label="Toggle small">
        <StarIcon />
      </Toggle>
      <Toggle aria-label="Toggle default">
        <StarIcon />
      </Toggle>
      <Toggle size="lg" aria-label="Toggle large">
        <StarIcon />
      </Toggle>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Toggle disabled aria-label="Toggle disabled">
      <StarIcon />
    </Toggle>
  ),
}
