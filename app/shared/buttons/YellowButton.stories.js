import YellowButton from './YellowButton'
import YellowButtonClient from './YellowButtonClient'

export default {
  title: 'Buttons/YellowButton',
  component: YellowButton,
  tags: ['autodocs'],
  args: {},
  render: (args) => (
    <div className="flex gap-3">
      <YellowButton {...args}>Yellow Button</YellowButton>
      <YellowButtonClient {...args}>Yellow Button Client</YellowButtonClient>
    </div>
  ),
}

export const Default = {}
