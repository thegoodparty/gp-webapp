'use client'
import React, { ReactNode, MouseEvent, useState, HTMLAttributes } from 'react'
import Link from 'next/link'
import { Button } from '@styleguide'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

interface PaymentPortalButtonProps extends Omit<
  HTMLAttributes<HTMLButtonElement>,
  'children'
> {
  redirectUrl?: string | null
  children: ReactNode
}

export const PaymentPortalButton = ({
  redirectUrl = null,
  children,
  ...restProps
}: PaymentPortalButtonProps): React.JSX.Element => {
  const [loading, setLoading] = useState(false)

  const onClick = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    trackEvent(EVENTS.Settings.Account.ClickManageSubscription)
    setLoading(true)
    const resp = await clientFetch<{ redirectUrl: string }>(
      apiRoutes.payments.createPortalSession,
    )
    const portalRedirectUrl = resp.data?.redirectUrl
    if (!portalRedirectUrl) {
      throw new Error('No portal redirect url found')
    }
    window.location.href = portalRedirectUrl
  }

  if (redirectUrl) {
    return (
      <Button asChild className="flex items-center" {...restProps}>
        <Link href={redirectUrl}>{children}</Link>
      </Button>
    )
  }

  return (
    <Button
      className="flex items-center"
      disabled={loading}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </Button>
  )
}
