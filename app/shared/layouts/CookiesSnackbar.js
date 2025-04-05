'use client'

import ErrorButton from '@shared/buttons/ErrorButton'
import { getCookie, setCookie } from 'helpers/cookieHelper'
import { useEffect, useState } from 'react'
import { isbot } from 'isbot'

export default function CookiesSnackbar() {
  const [showBanner, setShowBanner] = useState(false)
  useEffect(() => {
    const cookie = getCookie('cookiesAccepted')
    const isBot = isbot(navigator.userAgent)
    if (!cookie && !isBot) {
      setShowBanner(true)
    }
  }, [])
  if (!showBanner) {
    return null
  }
  const handleAccept = () => {
    setCookie('cookiesAccepted', 'true', 365)
    setShowBanner(false)
  }
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-dark text-white p-4 text-center" data-testid="cookie-snackbar">
      We use cookies to personalize content, analyze traffic, and provide you
      with a better user experience. By continuing to browse this site, you
      consent to the use of cookies.
      <div className="mt-6" onClick={handleAccept}>
        <ErrorButton className="ml-4" size="medium" dataTestId={"cookie-accept-btn"}>
          Accept
        </ErrorButton>
      </div>
    </div>
  )
}
