import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CalendarIcon } from '../components/ui/icons'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'

const meta: Meta<typeof HoverCard> = {
  title: 'Components/Hover Card',
  component: HoverCard,
  tags: ['autodocs'],
  argTypes: {
    openDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Delay in ms before the card opens on hover.',
    },
    closeDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Delay in ms before the card closes after hover ends.',
    },
  },
}

export default meta
type Story = StoryObj<typeof HoverCard>

export const Playground: Story = {
  args: {
    openDelay: 200,
    closeDelay: 100,
  },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          @goodparty
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/thegoodparty.png" />
            <AvatarFallback>GP</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@goodparty</h4>
            <p className="text-sm">
              Civic tech for independent candidates. Making people matter more
              than money in democracy.
            </p>
            <div className="text-muted-foreground flex items-center pt-2 text-xs">
              <CalendarIcon className="mr-2 size-3" />
              <span>Founded 2017</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          @goodparty
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/thegoodparty.png" />
            <AvatarFallback>GP</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@goodparty</h4>
            <p className="text-sm">
              Civic tech for independent candidates. Making people matter more
              than money in democracy.
            </p>
            <div className="text-muted-foreground flex items-center pt-2 text-xs">
              <CalendarIcon className="mr-2 size-3" />
              <span>Founded 2017</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const InlineMention: Story = {
  render: () => (
    <p className="max-w-md text-sm">
      Independent candidate{' '}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="h-auto p-0 text-sm">
            Jane Smith
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Jane Smith</h4>
            <p className="text-muted-foreground text-xs">
              Running for City Council · District 4
            </p>
            <p className="pt-2 text-sm">
              Small-business owner focused on housing affordability and local
              transit.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>{' '}
      announced her platform yesterday.
    </p>
  ),
}

export const WithOpenDelay: Story = {
  render: () => (
    <HoverCard openDelay={500} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="outline">Hover (500ms delay)</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm">
          This card waits 500ms before opening and 200ms before closing.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
}
