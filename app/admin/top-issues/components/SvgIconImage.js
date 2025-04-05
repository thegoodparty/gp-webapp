import Image from 'next/image'
import React from 'react'

export const SvgIconImage = ({ src }) => (
  <Image alt="Issue icon" width={40} height={40} src={src} />
)
