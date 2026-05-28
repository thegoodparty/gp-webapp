import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    rows: { control: { type: 'number', min: 1, max: 20, step: 1 } },
    placeholder: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Playground: Story = {
  args: {
    placeholder: 'Type your message here.',
    disabled: false,
    rows: 3,
  },
  render: ({ placeholder, disabled, rows }) => (
    <Textarea placeholder={placeholder} disabled={disabled} rows={rows} />
  ),
}

export const Default: Story = {
  render: () => <Textarea placeholder="Type your message here." />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-desc">Your message</Label>
      <Textarea placeholder="Type your message here." id="message-desc" />
      <p className="text-sm text-muted-foreground">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => <Textarea placeholder="Type your message here." disabled />,
}

export const WithCustomRows: Story = {
  render: () => <Textarea placeholder="Type your message here." rows={10} />,
}
