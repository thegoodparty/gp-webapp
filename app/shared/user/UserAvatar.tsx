import React from 'react'
import { MdPerson } from 'react-icons/md'
import { User } from '../../../helpers/types'

type UserAvatarSize = 'small' | 'large' | 'smaller'

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: User | null
  size?: UserAvatarSize
}

const UserAvatar = ({ user, size = 'small', ...restProps }: UserAvatarProps): React.JSX.Element => {
  const className = restProps?.className || ''
  if (!user) {
    return <></>
  }
  const { firstName, lastName } = user
  const initials = `${firstName?.charAt(0).toUpperCase() || ''}${
    lastName?.charAt(0).toUpperCase() || ''
  }`
  let sizeClass = 'h-8 w-8'
  let fontSizeClass = 'text-xl'
  if (size === 'large') {
    fontSizeClass = 'text-3xl'
    sizeClass = 'h-12 w-12'
  } else if (size === 'smaller') {
    sizeClass = 'h-6 w-6'
    fontSizeClass = 'text-lg'
  }

  return (
    <div className={`${sizeClass}`}>
      {user.avatar ? (
        <div
          className={`cursor-pointer rounded-full bg-cover bg-center ${sizeClass} ${className}`}
          style={{ backgroundImage: `url(${user.avatar})` }}
        ></div>
      ) : (
        <div
          className={`cursor-pointer flex items-center justify-center text-gray-500 uppercase ${fontSizeClass} ${sizeClass} ${className}`}
        >
          {initials ? <span>{initials}</span> : <MdPerson />}
        </div>
      )}
    </div>
  )
}

export default UserAvatar

