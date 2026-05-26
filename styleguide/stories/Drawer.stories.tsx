import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../components/ui/drawer'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Drawer>

type PlaygroundArgs = {
  open: boolean
  direction: 'top' | 'bottom' | 'left' | 'right'
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    open: false,
    direction: 'bottom',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state.',
    },
    direction: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
  render: ({ open, direction }) => {
    const [, updateArgs] = useArgs()
    return (
      <Drawer
        open={open}
        direction={direction}
        onOpenChange={(next) => updateArgs({ open: next })}
      >
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>
              Toggle direction in Controls to see how the drawer slides in.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <p>Drawer content goes here.</p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button>Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  },
}

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            This is a basic drawer component.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Drawer content goes here.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Form Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Item</DrawerTitle>
          <DrawerDescription>
            Fill in the details to create a new item.
          </DrawerDescription>
        </DrawerHeader>
        <form className="grid gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="drawer-name">Name</Label>
            <Input id="drawer-name" placeholder="Enter name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="drawer-description">Description</Label>
            <Textarea
              id="drawer-description"
              placeholder="Enter description"
              rows={4}
            />
          </div>
        </form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button type="submit">Create Item</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const WithCustomHeight: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Tall Drawer</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Tall Drawer</DrawerTitle>
          <DrawerDescription>
            This drawer has a custom height of 80vh.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <h3 className="font-medium">Section {i + 1}</h3>
                <p className="text-sm text-muted-foreground">
                  This is section {i + 1} of the drawer content.
                </p>
              </div>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
