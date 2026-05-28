import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from '../components/ui/icons'
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group'

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/Toggle Group',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      description:
        'Single allows one item selected at a time; multiple allows any number.',
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      description: 'Visual variant inherited by each item.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      description: 'Size inherited by each item.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the entire group.',
    },
  },
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Playground: Story = {
  args: {
    type: 'single',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  render: ({ type, variant, size, disabled }) => (
    <ToggleGroup
      key={type}
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      aria-label="Text alignment"
    >
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Single: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('center')
      return (
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={setValue}
          aria-label="Text alignment"
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeftIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenterIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRightIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      )
    }
    return <Demo />
  },
}

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" aria-label="Filters">
      <ToggleGroupItem value="active">Active</ToggleGroupItem>
      <ToggleGroupItem value="verified">Verified</ToggleGroupItem>
      <ToggleGroupItem value="featured">Featured</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" aria-label="Text alignment">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <ToggleGroup type="single" disabled aria-label="Text alignment">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}
