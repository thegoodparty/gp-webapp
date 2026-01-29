import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover'
import { Button } from '../components/ui/button'

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 ">
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
            <label className="text-sm font-medium">Width</label>
            <input
              type="number"
              className="w-full rounded-md border p-2"
              defaultValue={100}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Height</label>
            <input
              type="number"
              className="w-full rounded-md border p-2"
              defaultValue={100}
            />
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
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

export const WithCustomPosition: Story = {
  render: () => (
    <div className="flex h-[200px] items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" side="right" align="start">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Custom Position</h4>
            <p className="text-sm text-muted-foreground">
              This popover is positioned to the right of the trigger.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
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
