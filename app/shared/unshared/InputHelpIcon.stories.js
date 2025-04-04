import { InputHelpIcon } from 'app/(candidate)/dashboard/shared/InputHelpIcon'

export default {
  title: 'Unshared/InputHelpIcon',
  component: InputHelpIcon,
  tags: ['autodocs'],
  args: {
    message: 'Some helpful text here',
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-3 items-start">
        <strong>(Used in upgrade to pro pages)</strong>
        <InputHelpIcon {...args} />
      </div>
    )
  },
}

export const Default = {}
