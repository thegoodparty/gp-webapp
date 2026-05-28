import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { InfoIcon } from '../components/ui/icons'

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

type PlaygroundArgs = {
  open: boolean
  side: 'top' | 'right' | 'bottom' | 'left'
  align: 'start' | 'center' | 'end'
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    open: false,
    side: 'bottom',
    align: 'center',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state.',
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
    },
  },
  render: ({ open, side, align }) => {
    const [, updateArgs] = useArgs()
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Popover
          open={open}
          onOpenChange={(next) => updateArgs({ open: next })}
        >
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" side={side} align={align}>
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Settings</h4>
          <div className="space-y-2">
            <Label htmlFor="popover-width">Width</Label>
            <Input id="popover-width" type="number" defaultValue={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="popover-height">Height</Label>
            <Input id="popover-height" type="number" defaultValue={100} />
          </div>
          <Button className="w-full">Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="small">
          <InfoIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Information</h4>
          <p className="text-sm text-muted-foreground">
            This is an informational popover with an icon trigger.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Actions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Actions</h4>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              Edit
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Share
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
