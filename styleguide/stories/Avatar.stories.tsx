import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarIcon,
  AvatarImage,
} from '../components/ui/avatar'
import { CheckIcon, StarIcon, UserIcon } from '../components/ui/icons'

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
    variant: {
      control: 'select',
      options: [
        'default',
        'brightyellow',
        'lavender',
        'halogreen',
        'blue',
        'waxflower',
      ],
    },
  },
}
export default meta

type Story = StoryObj<typeof Avatar>

type PlaygroundArgs = {
  size: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge'
  variant:
    | 'default'
    | 'brightyellow'
    | 'lavender'
    | 'halogreen'
    | 'blue'
    | 'waxflower'
  showImage: boolean
  showBadge: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    size: 'medium',
    variant: 'default',
    showImage: false,
    showBadge: false,
  },
  argTypes: {
    showImage: {
      control: 'boolean',
      description:
        'Render an image. When false, falls back to the JD initials inside an AvatarFallback.',
    },
    showBadge: {
      control: 'boolean',
      description: 'Render a check badge in the bottom-right corner.',
    },
  },
  render: ({ size, variant, showImage, showBadge }) => (
    <Avatar size={size} variant={variant}>
      {showImage ? (
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      ) : null}
      <AvatarFallback>JD</AvatarFallback>
      {showBadge ? (
        <AvatarBadge>
          <CheckIcon className="h-3 w-3 text-success-main" />
        </AvatarBadge>
      ) : null}
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

export const WithBadge: Story = {
  render: () => (
    <Avatar size="large">
      <AvatarFallback>JD</AvatarFallback>
      <AvatarBadge>
        <CheckIcon className="h-3 w-3 text-success-main" />
      </AvatarBadge>
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

export const ColorVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar variant="default">
        <AvatarFallback>DF</AvatarFallback>
      </Avatar>
      <Avatar variant="brightyellow">
        <AvatarFallback>BY</AvatarFallback>
      </Avatar>
      <Avatar variant="lavender">
        <AvatarFallback>LV</AvatarFallback>
      </Avatar>
      <Avatar variant="halogreen">
        <AvatarFallback>HG</AvatarFallback>
      </Avatar>
      <Avatar variant="blue">
        <AvatarFallback>BL</AvatarFallback>
      </Avatar>
      <Avatar variant="waxflower">
        <AvatarFallback>WF</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const BadgePositions: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Avatar size="large">
        <AvatarFallback>TL</AvatarFallback>
        <AvatarBadge position="top-left" size="small">
          <div className="h-2 w-2 rounded-full bg-destructive" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>TR</AvatarFallback>
        <AvatarBadge position="top-right" size="small">
          <div className="h-2 w-2 rounded-full bg-success-main" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>BL</AvatarFallback>
        <AvatarBadge position="bottom-left" size="small">
          <div className="h-2 w-2 rounded-full bg-info-main" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>BR</AvatarFallback>
        <AvatarBadge position="bottom-right" size="small">
          <div className="h-2 w-2 rounded-full bg-warning-main" />
        </AvatarBadge>
      </Avatar>
    </div>
  ),
}

export const BadgeSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Avatar size="large">
        <AvatarFallback>S</AvatarFallback>
        <AvatarBadge size="small">
          <CheckIcon className="h-2 w-2" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>M</AvatarFallback>
        <AvatarBadge size="medium">
          <CheckIcon className="h-2.5 w-2.5" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>L</AvatarFallback>
        <AvatarBadge size="large">
          <CheckIcon className="h-3 w-3" />
        </AvatarBadge>
      </Avatar>
    </div>
  ),
}

export const IconWithColorAndBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar variant="brightyellow" size="large">
        <AvatarIcon>
          <UserIcon className="h-6 w-6" />
        </AvatarIcon>
        <AvatarBadge>
          <CheckIcon className="h-3 w-3 text-success-main" />
        </AvatarBadge>
      </Avatar>
      <Avatar variant="blue" size="large">
        <AvatarIcon>
          <UserIcon className="h-6 w-6" />
        </AvatarIcon>
        <AvatarBadge position="top-right">
          <StarIcon className="h-3 w-3 text-warning-main" />
        </AvatarBadge>
      </Avatar>
      <Avatar variant="halogreen" size="large">
        <AvatarIcon>
          <UserIcon className="h-6 w-6" />
        </AvatarIcon>
        <AvatarBadge position="bottom-left">
          <div className="h-3 w-3 rounded-full bg-destructive" />
        </AvatarBadge>
      </Avatar>
    </div>
  ),
}
