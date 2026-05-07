import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InputWithButton } from '../components/ui/input-with-button'

const meta: Meta<typeof InputWithButton> = {
  title: 'Components/InputWithButton',
  component: InputWithButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InputWithButton>

export const Inline: Story = {
  render: () => (
    <InputWithButton
      label="Zip code"
      placeholder="ZIP"
      buttonLabel="Search"
      layout="inline"
    />
  ),
}

export const InlineNoLabel: Story = {
  render: () => (
    <InputWithButton
      label="Zip code"
      showLabel={false}
      placeholder="ZIP"
      buttonLabel="Search"
      layout="inline"
    />
  ),
}

export const Stacked: Story = {
  render: () => (
    <InputWithButton
      label="Zip code"
      placeholder="ZIP"
      buttonLabel="Search"
      layout="stacked"
    />
  ),
}
