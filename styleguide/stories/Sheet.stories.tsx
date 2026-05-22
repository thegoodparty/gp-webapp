import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sheet>

type PlaygroundArgs = {
  open: boolean
  side: 'top' | 'right' | 'bottom' | 'left'
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    open: false,
    side: 'right',
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
  },
  render: ({ open, side }) => {
    const [, updateArgs] = useArgs()
    return (
      <Sheet open={open} onOpenChange={(next) => updateArgs({ open: next })}>
        <SheetTrigger asChild>
          <Button variant="outline">Open Sheet</Button>
        </SheetTrigger>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  },
}

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sheet-name" className="text-right">
              Name
            </Label>
            <Input
              id="sheet-name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sheet-username" className="text-right">
              Username
            </Label>
            <Input
              id="sheet-username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Form</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Fill in the details to create a new project.
          </SheetDescription>
        </SheetHeader>
        <form className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input id="project-name" placeholder="Enter project name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Enter project description"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  ),
}

export const WithCustomWidth: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Wide Sheet</Button>
      </SheetTrigger>
      <SheetContent className="w-[540px] sm:w-[640px]">
        <SheetHeader>
          <SheetTitle>Wide Sheet</SheetTitle>
          <SheetDescription>This sheet has a custom width.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Column 1</h4>
              <p className="text-sm text-muted-foreground">
                This is the first column of content.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Column 2</h4>
              <p className="text-sm text-muted-foreground">
                This is the second column of content.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
}
