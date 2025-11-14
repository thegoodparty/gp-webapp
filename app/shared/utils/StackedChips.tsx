import Chip from '@shared/utils/Chip'
import React from 'react'

interface StackedChipsProps {
  labels: string[]
  className?: string
  onClick?: (labels: string[], e: React.MouseEvent) => void
  [key: string]: unknown
}

export const StackedChips = ({
  labels,
  className = '',
  onClick = () => {},
  ...restProps
}: StackedChipsProps) => {
  const atMostThreeLabels = labels.slice(0, 3)
  return (
    <span
      className={`relative ${className}`}
      onClick={(e) => onClick(labels, e)}
      {...restProps}
    >
      {atMostThreeLabels.map((label, index) => (
        <span
          key={label}
          className={`
            min-h-4
            block
            ${index > 0 ? 'absolute' : 'relative'}
            cursor-pointer
          `.trim()}
          style={{
            zIndex: index === 0 ? 2 : 2 - index,
            right: index > 0 ? `-${index * 0.25}rem` : '0',
            top: '0',
          }}
        >
          <Chip
            {...{
              className: `
                px-2
                py-1
                rounded-full
                border
                border-gray-200
                bg-gray-100
                text-black
                font-normal
                flex
                items-center
                justify-center
                min-h-6
              `,
              label: index === 0 ? label : '##',
              variant: 'outlined',
            }}
          />
        </span>
      ))}
    </span>
  )
}

