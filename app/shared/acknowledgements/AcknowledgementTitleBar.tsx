'use client'
import React, { ReactNode, forwardRef, ForwardedRef } from 'react'

interface AcknowledgementTitleBarProps {
  emoticon?: ReactNode
  title: string
}

const AcknowledgementTitleBar = (
  { emoticon, title }: AcknowledgementTitleBarProps,
  ref: ForwardedRef<HTMLDivElement>,
): React.JSX.Element => (
  <div
    ref={ref}
    className="scroll-mt-16 bg-gray-200 p-4 font-bold rounded mb-6 flex items-center"
  >
    {emoticon || <></>}
    <div>{title}</div>
  </div>
)

export default forwardRef(AcknowledgementTitleBar)
