'use client';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useState } from 'react';

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
    setLoading(true);
    const portalResult = await gpFetch(gpApi.payments.createPortalSession);
    const { redirectUrl: portalRedirectUrl } = portalResult || {};
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
