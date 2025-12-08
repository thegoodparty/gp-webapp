import Image from 'next/image'
import React from 'react'

interface SvgIconImageProps {
  src: string
}

export const SvgIconImage = ({ src }: SvgIconImageProps): React.JSX.Element => (
  <Image alt="Issue icon" width={40} height={40} src={src} />
)


