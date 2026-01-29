import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UserIcon, CheckIcon, StarIcon } from '../components/ui/icons'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIcon,
  AvatarBadge,
} from '../components/ui/avatar'

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'Components/Avatar',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Avatar>

// Basic Examples
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

// Compound Component Pattern Examples
export const WithBadge: Story = {
  render: () => (
    <Avatar size="large">
      <AvatarFallback>JD</AvatarFallback>
      <AvatarBadge>
        <CheckIcon className="h-3 w-3 text-green-600" />
      </AvatarBadge>
    </Avatar>
  ),
}

export const CompoundComponentPattern: Story = {
  render: () => (
    <Avatar size="large">
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback>CN</Avatar.Fallback>
      <Avatar.Badge position="top-right" size="small">
        <StarIcon className="h-2 w-2 text-yellow-500" />
      </Avatar.Badge>
    </Avatar>
  ),
}

// Size Variants
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

// Color Variants
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

// Badge Positioning Examples
export const BadgePositions: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Avatar size="large">
        <AvatarFallback>TL</AvatarFallback>
        <AvatarBadge position="top-left" size="small">
          <div className="h-2 w-2 bg-red-500 rounded-full" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>TR</AvatarFallback>
        <AvatarBadge position="top-right" size="small">
          <div className="h-2 w-2 bg-green-500 rounded-full" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>BL</AvatarFallback>
        <AvatarBadge position="bottom-left" size="small">
          <div className="h-2 w-2 bg-blue-500 rounded-full" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>BR</AvatarFallback>
        <AvatarBadge position="bottom-right" size="small">
          <div className="h-2 w-2 bg-yellow-500 rounded-full" />
        </AvatarBadge>
      </Avatar>
    </div>
  ),
}

// Badge Sizes
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

// Complex Examples
export const IconWithColorAndBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar variant="brightyellow" size="large">
        <AvatarIcon>
          <UserIcon className="h-6 w-6" />
        </AvatarIcon>
        <AvatarBadge>
          <CheckIcon className="h-3 w-3 text-green-600" />
        </AvatarBadge>
      </Avatar>
      <Avatar variant="blue" size="large">
        <AvatarIcon>
          <UserIcon className="h-6 w-6" />
        </AvatarIcon>
        <AvatarBadge position="top-right">
          <StarIcon className="h-3 w-3 text-yellow-500" />
        </AvatarBadge>
      </Avatar>
      <Avatar variant="halogreen" size="large">
        <AvatarIcon>
          <UserIcon className="h-6 w-6" />
        </AvatarIcon>
        <AvatarBadge position="bottom-left">
          <div className="h-3 w-3 bg-red-500 rounded-full" />
        </AvatarBadge>
      </Avatar>
    </div>
  ),
}

// Fallback Examples
export const FallbackExamples: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="/broken-image.jpg" alt="Broken" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/broken-image.jpg" alt="Broken" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/broken-image.jpg" alt="Broken" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  ),
}
