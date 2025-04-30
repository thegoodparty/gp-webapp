export const getUserFullName = (user) =>
  user?.firstName || user?.lastName
    ? `${user.firstName} ${user.lastName}`.trim()
    : ''
