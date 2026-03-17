import { User } from './types'

export const buildUserTraits = (
  user: User,
): Record<string, string> => {
  const traits: Record<string, string> = {}
  if (user.email) traits.email = user.email
  if (user.firstName || user.lastName)
    traits.name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  if (user.phone) traits.phone = user.phone
  if (user.zip) traits.zip = user.zip
  return traits
}
