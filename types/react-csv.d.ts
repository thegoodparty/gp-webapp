declare module 'react-csv' {
  import React from 'react'

  interface CSVLinkProps {
    data: (string | number | Date | null | undefined)[][] | object[]
    filename?: string
    headers?: { label: string; key: string }[]
    separator?: string
    enclosingCharacter?: string
    uFEFF?: boolean
    target?: string
    asyncOnClick?: boolean
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
    children?: React.ReactNode
    className?: string
  }

  export const CSVLink: React.FC<CSVLinkProps>
  export const CSVDownload: React.FC<CSVLinkProps>
}

