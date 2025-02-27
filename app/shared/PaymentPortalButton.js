'use client';
import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useState } from 'react';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';

const PaymentPortalStyledButton = ({ children, ...restProps }) => (
  <PrimaryButton className="flex items-center" {...restProps}>
    {children}
  </PrimaryButton>
);

export const PaymentPortalButton = ({
  redirectUrl = null,
  children,
  ...restProps
}) => {
  const [loading, setLoading] = useState(false);

  const onClick = async (e) => {
    e.preventDefault();
    trackEvent(EVENTS.Settings.Account.ClickManageSubscription);
    setLoading(true);
    const resp = await clientFetch(apiRoutes.payments.createPortalSession);
    const { redirectUrl: portalRedirectUrl } = resp.data || {};
    if (!portalRedirectUrl) {
      throw new Error('No portal redirect url found');
    }
    window.location.href = portalRedirectUrl;
  };

  return redirectUrl ? (
    <Link href={redirectUrl}>
      <PaymentPortalStyledButton {...restProps}>
        {children}
      </PaymentPortalStyledButton>
    </Link>
  ) : (
    <PaymentPortalStyledButton
      disabled={loading}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </PaymentPortalStyledButton>
  );
};
