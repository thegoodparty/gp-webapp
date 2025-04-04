import BlackButton from './BlackButton'
import BlackButtonClient from './BlackButtonClient'

export default {
  title: 'Buttons/BlackButton',
  component: BlackButton,
  tags: ['autodocs'],
  args: {},
  render: (args) => (
    <div className="flex gap-3">
      <BlackButton {...args}>Black Button</BlackButton>
      <BlackButtonClient {...args}>Black Button Client</BlackButtonClient>
    </div>
  ),
}

export const Default = {}
