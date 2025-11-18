import { User } from 'helpers/types'

export const getUserFullName = (user: User | null | undefined): string =>
  user?.firstName || user?.lastName
    ? `${user.firstName} ${user.lastName}`.trim()
    : ''

