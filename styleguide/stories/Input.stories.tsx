import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { SearchIcon } from '../components/ui/icons'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'file'],
    },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Input>

type PlaygroundArgs = {
  type: 'text' | 'email' | 'password' | 'number' | 'search' | 'file'
  placeholder: string
  disabled: boolean
  showIcon: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    type: 'text',
    placeholder: 'Enter your text here',
    disabled: false,
    showIcon: false,
  },
  argTypes: {
    showIcon: {
      control: 'boolean',
      description: 'Render a left-aligned SearchIcon inside the input.',
    },
  },
  render: ({ type, placeholder, disabled, showIcon }) => (
    <Input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      icon={showIcon ? <SearchIcon /> : undefined}
    />
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-error">Email</Label>
      <Input
        type="email"
        id="email-error"
        placeholder="Email"
        defaultValue="not-an-email"
        aria-invalid
        aria-describedby="email-error-message"
      />
      <p id="email-error-message" className="text-sm text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  ),
}

export const ErrorFocused: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-error-focused">Email</Label>
      <Input
        type="email"
        id="email-error-focused"
        placeholder="Email"
        defaultValue="not-an-email"
        aria-invalid
        autoFocus
        aria-describedby="email-error-focused-message"
      />
      <p id="email-error-focused-message" className="text-sm text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const WithIcon: Story = {
  render: () => <Input icon={<SearchIcon />} placeholder="Search..." />,
}

export const File: Story = {
  args: {
    type: 'file',
  },
}
