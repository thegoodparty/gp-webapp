import React from 'react'
import { FaFacebook } from 'react-icons/fa'

interface FacebookLogoProps {
  size?: number
}

export default function FacebookLogo({
  size = 18,
}: FacebookLogoProps): React.JSX.Element {
  return <FaFacebook size={size} color="#1877F2" />
}
