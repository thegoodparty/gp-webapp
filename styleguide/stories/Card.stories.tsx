import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

type PlaygroundArgs = {
  title: string
  description: string
  body: string
  showFooter: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    title: 'Notifications',
    description: 'You have 3 unread messages.',
    body: 'View and manage your notifications here.',
    showFooter: true,
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    body: { control: 'text' },
    showFooter: { control: 'boolean' },
  },
  render: ({ title, description, body, showFooter }) => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
      {showFooter ? (
        <CardFooter>
          <Button variant="outline" className="w-full">
            View all
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  ),
}

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Input id="framework" placeholder="e.g. Next.js" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <img
          src="https://images.unsplash.com/photo-1522252234503-e356532cafd5"
          alt="Card header"
          className="h-48 w-full object-cover"
        />
      </CardHeader>
      <CardContent>
        <CardTitle>Project Title</CardTitle>
        <CardDescription className="mt-2">
          This is a description of the project. It can be multiple lines long
          and will wrap appropriately.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Learn More</Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>View and manage your notifications here.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View all
        </Button>
      </CardFooter>
    </Card>
  ),
}
