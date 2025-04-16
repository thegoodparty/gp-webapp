'use client'

import { getCookie, setCookie } from 'helpers/cookieHelper'
import { useEffect, useState } from 'react'
import { isbot } from 'isbot'
import { MdClose } from 'react-icons/md'
import SecondaryButton from '@shared/buttons/SecondaryButton'

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
    <div className="fixed bottom-4 flex justify-center w-full">
      <div
        className="bg-primary-dark text-white p-4 flex max-w-[440px] mx-8 rounded-lg"
        data-testid="cookie-snackbar"
      >
        <span className="text-xs">
          By continuing to browse this site, you consent to the use of cookies.
        </span>
        <SecondaryButton
          className="ml-6 flex items-center inline"
          onClick={handleAccept}
          size="medium"
          dataTestId={'cookie-accept-btn'}
        >
          Close
          <MdClose className="ml-2 text-xl" />
        </SecondaryButton>
      </div>
    </div>
  )
}
