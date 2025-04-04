import Pill from './Pill'

export default {
  title: 'Buttons/Pill',
  component: Pill,
  tags: ['autodocs'],
  args: {},
  render: (args) => (
    <div className="flex gap-3">
      <Pill {...args}>Pill</Pill>
      <Pill {...args} outlined>
        Outlined Pill
      </Pill>
    </div>
  ),
}

export const Default = {}
