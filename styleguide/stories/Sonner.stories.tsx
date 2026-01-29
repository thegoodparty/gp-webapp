import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Toaster as Sonner, toast } from 'sonner'
import { Button } from '../components/ui/button'

const meta: Meta<typeof Sonner> = {
  title: 'Components/Sonner',
  component: Sonner,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Sonner>

export const Default: Story = {
  render: () => (
    <div>
      <Button onClick={() => toast('This is a toast notification!')}>
        Show Toast
      </Button>
      <Sonner />
    </div>
  ),
}
