import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Textarea } from '../components/ui/textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: () => <Textarea placeholder="Type your message here." />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <label htmlFor="message">Your message</label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <label htmlFor="message">Your message</label>
      <Textarea placeholder="Type your message here." id="message" />
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

export const WithCustomClassName: Story = {
  render: () => (
    <Textarea
      placeholder="Type your message here."
      className="min-h-[200px] resize-none"
    />
  ),
}
