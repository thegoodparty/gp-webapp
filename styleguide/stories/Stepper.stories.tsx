import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Stepper } from '../components/ui/stepper'

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Stepper>

export const Bar: Story = {
  render: () => <Stepper variant="bar" currentStep={2} totalSteps={5} />,
}
