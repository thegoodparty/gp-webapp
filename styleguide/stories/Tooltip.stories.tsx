import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip'
import { Button } from '../components/ui/button'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to favorites</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const WithDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover with delay</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip has a 300ms delay</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Multiple: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Copy</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy to clipboard</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Share</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share with others</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Delete</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete permanently</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const WithCustomContent: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Custom content</Button>
        </TooltipTrigger>
        <TooltipContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Custom tooltip</h4>
            <p className="text-sm text-muted-foreground">
              This tooltip has custom content with a title and description.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
