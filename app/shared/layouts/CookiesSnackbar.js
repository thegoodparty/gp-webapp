'use client';

import ErrorButton from '@shared/buttons/ErrorButton';
import { getCookie, setCookie } from 'helpers/cookieHelper';

export default function CookiesSnackbar() {
  const cookie = getCookie('cookiesAccepted');
  if (cookie) {
    return null;
  }
  const handleAccept = () => {
    setCookie('cookiesAccepted', 'true', 365);
    document.location.reload();
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-white p-4 text-center">
      <p>
        We use cookies to personalize content, analyze traffic, and provide you
        with a better user experience. By continuing to browse this site, you
        consent to the use of cookies.
        <div className="mt-6" onClick={handleAccept}>
          <ErrorButton className="ml-4" size="medium">
            Accept
          </ErrorButton>
        </div>
      </p>
    </div>
  );
}
