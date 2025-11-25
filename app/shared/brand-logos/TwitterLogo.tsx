import React from 'react'
import { FaSquareXTwitter } from 'react-icons/fa6'

interface TwitterLogoProps {
  size?: number
}

export default function TwitterLogo({ size = 18 }: TwitterLogoProps): React.JSX.Element {
  return <FaSquareXTwitter size={size} />
}
