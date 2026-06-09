import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Avatar,
  AvatarFallback,
  AvatarIcon,
  AvatarImage,
} from '../components/ui/avatar'
import { UserIcon } from '../components/ui/icons'

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'Components/Avatar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xSmall', 'small', 'medium', 'large', 'xLarge'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Avatar>

type PlaygroundArgs = {
  size: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge'
  shape: 'circle' | 'square'
  showImage: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    size: 'medium',
    shape: 'circle',
    showImage: false,
  },
  argTypes: {
    showImage: {
      control: 'boolean',
      description:
        'Render an image. When false, falls back to the JD initials inside an AvatarFallback.',
    },
  },
  render: ({ size, shape, showImage }) => (
    <Avatar key={`${String(showImage)}-${shape}`} size={size} shape={shape}>
      {showImage ? (
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      ) : null}
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
}

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Avatar>
      <AvatarIcon>
        <UserIcon className="h-5 w-5" />
      </AvatarIcon>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xSmall">
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar size="small">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar size="medium">
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar size="xLarge">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
}
