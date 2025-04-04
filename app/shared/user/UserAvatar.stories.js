import UserAvatar from './UserAvatar'

export default {
  title: 'User/UserAvatar',
  component: UserAvatar,
  tags: ['autodocs'],
  args: {
    user: {
      firstName: null,
      lastName: null,
      avatar: null,
    },
  },
  render: (args) => (
    <div className="flex gap-3 text-dark">
      <UserAvatar {...args} size="large" />
      <UserAvatar {...args} size="small" />
      <UserAvatar {...args} size="smaller" />
    </div>
  ),
}

export const Default = {}
export const WithImage = {
  args: {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://i.pravatar.cc/100?u=goodparty123',
    },
  },
}
export const WithInitials = {
  args: {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
    },
  },
}
