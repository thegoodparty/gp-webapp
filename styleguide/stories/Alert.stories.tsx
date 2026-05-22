import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import {
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
} from '../components/ui/icons'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'destructive'],
      description:
        'Visual treatment. Sets border, text, and icon colors for the alert tone.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Alert>

const variantIcons = {
  default: <InfoIcon />,
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  destructive: <XCircleIcon />,
}

type PlaygroundArgs = {
  variant: 'default' | 'info' | 'success' | 'destructive'
  showIcon: boolean
  title: string
  description: string
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    variant: 'info',
    showIcon: true,
    title: 'Heads up!',
    description: 'You can add components and dependencies to your app.',
  },
  argTypes: {
    showIcon: {
      control: 'boolean',
      description: 'Render an icon to the left of the title and description.',
    },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  render: ({ variant, showIcon, title, description }) => (
    <Alert variant={variant} icon={showIcon ? variantIcons[variant] : undefined}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  ),
}

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
}

export const Info: Story = {
  render: () => (
    <Alert variant="info" icon={<InfoIcon />}>
      <AlertTitle>Alert Title</AlertTitle>
      <AlertDescription>This is an alert description.</AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert variant="success" icon={<CheckCircleIcon />}>
      <AlertTitle>Success! Your changes have been saved.</AlertTitle>
      <AlertDescription>
        This is an alert with icon, title and description.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" icon={<XCircleIcon />}>
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Alert>
      <AlertTitle>New feature available!</AlertTitle>
      <AlertDescription>
        Check out our new dashboard feature. It&apos;s now available for all
        users.
      </AlertDescription>
      <Button size="small" className="col-start-2 mt-2 w-fit">
        Learn more
      </Button>
    </Alert>
  ),
}
