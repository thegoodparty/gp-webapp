import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Drawer>

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
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="rounded-md border p-2"
              placeholder="Enter name"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="rounded-md border p-2"
              placeholder="Enter description"
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="type">Type</label>
            <select id="type" className="rounded-md border p-2">
              <option value="">Select a type</option>
              <option value="type1">Type 1</option>
              <option value="type2">Type 2</option>
              <option value="type3">Type 3</option>
            </select>
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

export const WithNestedContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Nested Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nested Content</DrawerTitle>
          <DrawerDescription>
            This drawer contains nested content sections.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <div className="space-y-6">
            <section className="space-y-2">
              <h3 className="font-medium">Section 1</h3>
              <div className="rounded-lg border p-4">
                <p>Content for section 1</p>
              </div>
            </section>
            <section className="space-y-2">
              <h3 className="font-medium">Section 2</h3>
              <div className="rounded-lg border p-4">
                <p>Content for section 2</p>
              </div>
            </section>
            <section className="space-y-2">
              <h3 className="font-medium">Section 3</h3>
              <div className="rounded-lg border p-4">
                <p>Content for section 3</p>
              </div>
            </section>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
          <Button>Save Changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
