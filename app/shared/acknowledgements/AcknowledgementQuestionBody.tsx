import React, { ReactNode } from 'react'

interface AcknowledgementQuestionBodyProps {
  children: ReactNode
  className?: string
  show: boolean
}

export const AcknowledgementQuestionBody = ({
  children,
  className = '',
  show,
}: AcknowledgementQuestionBodyProps): React.JSX.Element => (
  <div className={`px-6 pb-10 ${show ? 'block' : 'hidden'} ${className}`}>
    {children}
  </div>
)
