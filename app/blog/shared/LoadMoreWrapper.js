'use client'

import { useState } from 'react'
import PrimaryButton from '@shared/buttons/PrimaryButton'

/**
 * Wraps content to hide displaying it behind a button click
 */
export default function LoadMoreWrapper({ children, className }) {
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
