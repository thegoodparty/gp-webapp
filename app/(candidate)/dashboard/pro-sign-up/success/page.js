import pageMetaData from 'helpers/metadataHelper';
import PurchaseSuccessPage from 'app/(candidate)/dashboard/pro-sign-up/success/components/PurchaseSuccessPage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { cookies } from 'next/headers';

const meta = pageMetaData({
  title: 'Pro Sign Up - Purchase Success | GoodParty.org',
  description: 'Pro Sign Up - Purchase Success',
  slug: '/dashboard/pro-sign-up/success',
});
export const metadata = meta;

export default async function Page({
  searchParams: { session_id: checkoutSessionId },
}) {
  if (!checkoutSessionId) {
    throw new Error('No session_id provided');
  }

  try {
    const nextCookies = cookies();
    const tempToken = nextCookies.get('temp-token');

    if (!tempToken) {
      throw new Error('No temp-token found');
    }

    const result = await gpFetch(
      gpApi.user.refresh,
      null,
      null,
      tempToken.value,
    );

    const { user } = result;
    if (!user) {
      throw new Error('Could not retrieve user');
    }
    const { customerId } = JSON.parse(user.metaData || '{}');

    if (!customerId) {
      await gpFetch(
        {
          ...gpApi.payments.updateCheckoutSession,
          url: `${gpApi.payments.updateCheckoutSession.url}/${checkoutSessionId}`,
        },
        null,
        null,
        tempToken.value,
      );
    }

    const portalResult = await gpFetch(
      gpApi.payments.createPortalSession,
      null,
      null,
      tempToken.value,
    );

    const { redirectUrl: portalRedirectUrl } = portalResult || {};
    if (!portalRedirectUrl) {
      throw new Error('No portal redirect url found');
    }

    const childProps = {
      portalRedirectUrl,
    };

    return <PurchaseSuccessPage {...childProps} />;
  } catch (e) {
    console.error('Failure updating checkout session');
    throw e;
  }
}
