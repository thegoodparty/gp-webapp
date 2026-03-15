'use client'
import Confetti from './Confetti'
import H1 from '@shared/typography/H1'
import { useEffect } from 'react'
import { trackEvent } from 'helpers/analyticsHelper'
import Button from '@shared/buttons/Button'

export default function Done(): React.JSX.Element {
  useEffect(() => {
    trackEvent('question_complete', { complete: true })
  }, [])
  return (
    <div className="flex flex-col h-[calc(100vh-216px)] items-center justify-center">
      <H1 className="text-center">You&apos;re all set!</H1>
      <Button href="/dashboard/content" size="large" className="mt-10 block">
        Back to Dashboard
      </Button>
      <Confetti />
    </div>
  )
}
