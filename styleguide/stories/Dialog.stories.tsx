import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useArgs } from 'storybook/preview-api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    modal: {
      control: 'boolean',
      description:
        'When true (default), interaction with outside elements is blocked while the dialog is open.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

type PlaygroundArgs = {
  modal: boolean
  open: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    modal: true,
    open: false,
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state. Toggle to open or close the dialog.',
    },
  },
  render: ({ modal, open }) => {
    const [, updateArgs] = useArgs()
    return (
      <Dialog
        modal={modal}
        open={open}
        onOpenChange={(next) => updateArgs({ open: next })}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Playground dialog</DialogTitle>
            <DialogDescription>
              Toggle modal and open in Controls to see how the dialog behaves.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => updateArgs({ open: false })}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Confirm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Subscribe</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to newsletter</DialogTitle>
          <DialogDescription>
            Enter your email below to receive our weekly newsletter.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Subscribe</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
