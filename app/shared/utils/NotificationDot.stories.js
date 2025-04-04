import IconButton from '@shared/buttons/IconButton'
import { NotificationDot } from './NotificationDot'
import { MdNotifications } from 'react-icons/md'

export default {
  title: 'Utils/NotificationDot',
  component: NotificationDot,
  tags: ['autodocs'],
  args: {},
  render: (args) => (
    <>
      <IconButton className="relative">
        <MdNotifications />
        <NotificationDot />
      </IconButton>
    </>
  ),
}

export const Default = {}
