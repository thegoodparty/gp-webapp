import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/ui/collapsible'
import { Button } from '../components/ui/button'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the collapsible starts open.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the trigger so the content cannot be toggled.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Playground: Story = {
  args: {
    defaultOpen: false,
    disabled: false,
  },
  render: (args) => (
    <Collapsible {...args} className="w-80 space-y-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={args.disabled}
        >
          Show details
          <ChevronsUpDown className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
        <div className="text-muted-foreground rounded-md border p-4 text-sm">
          The Playground story consumes <code>args</code>. Toggle{' '}
          <code>defaultOpen</code> and <code>disabled</code> in the Controls
          panel to see the component respond.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(false)
      return (
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="w-80 space-y-2"
        >
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-sm font-semibold">Recent activity</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown className="size-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            campaign-launch.md
          </div>
          <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up space-y-2 overflow-hidden">
            <div className="rounded-md border px-4 py-2 font-mono text-sm">
              voter-outreach.md
            </div>
            <div className="rounded-md border px-4 py-2 font-mono text-sm">
              donor-thank-you.md
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    }
    return <Demo />
  },
}

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-80 space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          Show details
          <ChevronsUpDown className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
        <div className="text-muted-foreground rounded-md border p-4 text-sm">
          Collapsible starts open via the <code>defaultOpen</code> prop. The
          content animates in and out using the{' '}
          <code>animate-collapsible-down</code> /{' '}
          <code>animate-collapsible-up</code> design-token animations.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Collapsible disabled className="w-80 space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between" disabled>
          Disabled trigger
          <ChevronsUpDown className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="text-muted-foreground rounded-md border p-4 text-sm">
          You should not be able to open this.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
