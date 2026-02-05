'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { completeCheckoutSession } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'
import { reportErrorToNewRelic } from '@shared/new-relic'
import Body1 from '@shared/typography/Body1'
import H2 from '@shared/typography/H2'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { CircularProgress } from '@mui/material'

/**
 * Page that handles the return from Stripe Checkout.
 * Completes the purchase by calling the backend and displays a success/error message.
 */
export default function PurchaseCompletePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams?.get('session_id')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const completePurchase = async () => {
      if (!sessionId) {
        setStatus('error')
        setErrorMessage('No session ID found')
        return
      }

      try {
        const response = await completeCheckoutSession(sessionId)
        if (response.ok) {
          setStatus('success')
        } else {
          throw new Error(
            (response.data as { data?: { error?: string } })?.data?.error ||
              'Failed to complete purchase',
          )
        }
      } catch (error) {
        setStatus('error')
        setErrorMessage(
          error instanceof Error ? error.message : 'An error occurred',
        )
        reportErrorToNewRelic(error as Error, {
          location: 'purchase-complete',
          sessionId,
        })
      }
    }

    completePurchase()
  }, [sessionId])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      {status === 'loading' && (
        <div className="text-center">
          <CircularProgress className="mb-4" />
          <Body1>Processing your payment...</Body1>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <div className="mb-4 text-6xl">✓</div>
          <H2 className="mb-4">Payment Successful!</H2>
          <Body1 className="mb-6">
            Thank you for your purchase. Your order is being processed.
          </Body1>
          <PrimaryButton onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </PrimaryButton>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-500">✕</div>
          <H2 className="mb-4">Payment Issue</H2>
          <Body1 className="mb-6 text-red-600">
            {errorMessage || 'There was an issue processing your payment.'}
          </Body1>
          <PrimaryButton onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}
