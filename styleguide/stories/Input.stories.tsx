import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Search } from 'lucide-react'
import { Input } from '../components/ui/input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter your text here',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="email">Email</label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="email">Email</label>
      <Input
        type="email"
        id="email"
        placeholder="Email"
        className="border-red-500"
      />
      <p className="text-sm text-red-500">
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
  render: () => <Input icon={<Search />} placeholder="Search..." />,
}

export const File: Story = {
  args: {
    type: 'file',
  },
}
