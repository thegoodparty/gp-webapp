import React from 'react'

interface NextdoorLogoProps {
  size?: number
}

export default function NextdoorLogo({ size = 18 }: NextdoorLogoProps): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#8ED500" />
      <g transform="translate(7.8 8.531) scale(0.8)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0c1.36-2.016 3.786-3.332 6.63-3.332 4.4 0 7.796 3.15 7.796 7.157v8.4a.385.385 0 01-.38.384h-3.5a.38.38 0 01-.38-.384v-7.815c0-1.737-1.326-3.707-3.536-3.707-2.316 0-3.536 1.97-3.536 3.707v7.813a.387.387 0 01-.383.384H-.767a.377.377 0 01-.352-.235.385.385 0 01-.029-.147V4.662a.505.505 0 00-.376-.482c-3.077-.843-4.21-3.197-4.289-6.567a.387.387 0 01.235-.361.378.378 0 01.148-.03h2.76v.02h.835a.384.384 0 01.381.37c.04 1.378.314 2.118.964 2.512a.378.378 0 00.51-.125z"
          fill="white"
        />
      </g>
    </svg>
  )
}
