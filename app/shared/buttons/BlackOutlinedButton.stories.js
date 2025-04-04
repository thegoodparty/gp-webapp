import BlackOutlinedButton from './BlackOutlinedButton'
import BlackOutlinedButtonClient from './BlackOutlinedButtonClient'

export default {
  title: 'Buttons/BlackOutlinedButton',
  component: BlackOutlinedButton,
  tags: ['autodocs'],
  args: {},
  render: (args) => (
    <div className="flex gap-3">
      <BlackOutlinedButton {...args}>Black Button</BlackOutlinedButton>
      <BlackOutlinedButtonClient {...args}>
        Black Button Client
      </BlackOutlinedButtonClient>
    </div>
  ),
}

export const Default = {}
