'use client'
import InlineSVG from 'react-inlinesvg'
import React from 'react'

interface DynamicSVGIconProps {
  svgData: string
  className?: string
}

export const DynamicSVGIcon = ({
  svgData,
  className,
}: DynamicSVGIconProps): React.JSX.Element => (
  <InlineSVG
    src={svgData}
    className={`relative block w-[2.5rem] h-[2.5rem]${
      className ? ` ${className}` : ''
    }`}
  />
)
