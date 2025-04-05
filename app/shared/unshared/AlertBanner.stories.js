import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner'

export default {
  title: 'Unshared/AlertBanner',
  component: AlertBanner,
  tags: ['autodocs'],
  args: {
    title: 'You have an alert',
    message: 'Some content for you to pay attention to please now',
    actionText: 'Click Here',
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-3">
        <strong>(Used in dashboard)</strong>
        <AlertBanner {...args} severity="info" />
        <AlertBanner {...args} severity="success" />
        <AlertBanner {...args} severity="warning" />
        <AlertBanner {...args} severity="error" />
      </div>
    )
  },
}

export const Default = {}
