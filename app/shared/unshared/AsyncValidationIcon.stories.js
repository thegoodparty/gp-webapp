import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon'

export default {
  title: 'Unshared/AsyncValidationIcon',
  component: AsyncValidationIcon,
  tags: ['autodocs'],
  render: (args) => {
    return (
      <div className="flex flex-col gap-3 items-start">
        <strong>(Used in upgrade to pro pages)</strong>
        <p>Default</p>
        <AsyncValidationIcon {...args} />
        <p>Loading</p>
        <AsyncValidationIcon {...args} loading />
        <p>Validated</p>
        <AsyncValidationIcon {...args} validated={true} />
        <p>Validate Failed</p>
        <AsyncValidationIcon {...args} validated={false} />
      </div>
    )
  },
}

export const Default = {}
