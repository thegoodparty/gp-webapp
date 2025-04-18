'use client'
import { IoIosCloseCircle } from 'react-icons/io'
import { useEffect, useState } from 'react'
import Button from '@shared/buttons/Button'
import { useLocalStorage } from '@shared/hooks/useLocalStorage'

const PROMO_URL =
  'https://goodpartyorg.circle.so/join?invitation_token=972b834345e05305e97fcc639c51ac54e3a04d8b-1c106100-4719-4b8a-81e1-73e513bbcd5f'
const HIDE_PROMO_LOCAL_STORAGE_KEY = 'hide-promo'

export default function PromoBanner() {
  const [hidePromo, setHidePromo] = useLocalStorage(
    HIDE_PROMO_LOCAL_STORAGE_KEY,
    false,
  )
  const [showPromo, setshowPromo] = useState(true)

  useEffect(() => {
    try {
      setshowPromo(!hidePromo)
    } catch (e) {
      console.log(e)
    }
  }, [])

  const handleClose = () => {
    try {
      setHidePromo(true)
      setshowPromo(false)
    } catch (e) {
      console.log(e)
    }
  }

  return showPromo ? (
    <div className="flex w-screen h-auto">
      <div className="flex w-full bg-lime-400 lg:block border-solid border-b border-zinc-200 p-2 h-full">
        <div className="flex w-full h-14">
          <div className="flex w-full justify-center items-center ">
            <div className="flex items-center md:text-lg">
              <span>Join the GoodParty.org Community on Circle</span>
            </div>
            <Button
              id="nav-stickers-callout"
              href={PROMO_URL}
              target="_blank"
              aria-label="Claim Your Stickers"
              size="large"
              className="whitespace-nowrap ml-5 !py-2 border-none"
            >
              Join
            </Button>
          </div>
          <div
            className="flex px-3 mr-2 cursor-pointer"
            onKeyDown={(e) => e.key === 'Enter' && handleClose()}
            onClick={handleClose}
          >
            <IoIosCloseCircle role="button" tabIndex={0} size={24} />
          </div>
        </div>
      </div>
    </div>
  ) : null
}
