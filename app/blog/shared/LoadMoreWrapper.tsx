'use client'

import { useState } from 'react'
import PrimaryButton from '@shared/buttons/PrimaryButton'

interface LoadMoreWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function LoadMoreWrapper({ children, className }: LoadMoreWrapperProps): React.JSX.Element {
  const [showMore, setShowMore] = useState(false)

  return (
    <div className={className}>
      <PrimaryButton
        onClick={() => setShowMore(true)}
        className={showMore ? 'hidden' : 'block'}
        size="large"
        fullWidth
      >
        Load More
      </PrimaryButton>
      <div className={showMore ? 'block' : 'hidden'}>{children}</div>
    </div>
  )
}
