'use client'
import { useEffect, useState } from 'react'
import SignupForm from '@shared/inputs/SignupForm'
import Image from 'next/image'
import { setCookie, getCookie } from 'helpers/cookieHelper'
import Modal from '@shared/utils/Modal'

const POPUP_DELAY = 20000
export default function BlogPopup() {
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => {
    setShowModal(true)
  }

  useEffect(() => {
    const cookie = getCookie('blogPopup')
    if (!cookie || cookie !== 'closed') {
      const timer = setTimeout(handleOpenModal, POPUP_DELAY)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [])

  return (
    <Modal
      open={showModal}
      closeCallback={() => {
        setShowModal(false)
        setCookie('blogPopup', 'closed', 1)
      }}
    >
      <div className=" w-[90vw] max-w-[420px] mx-auto">
        <Image
          src="/images/logo/heart.svg"
          alt="GoodParty"
          width={46}
          height={46}
        />

        <h2 className="text-2xl font-black my-1">
          Stay up to date with GoodParty.org
        </h2>

        <SignupForm
          formId="5d84452a-01df-422b-9734-580148677d2c"
          pageName={`blog-article`}
          label="Get involved"
          labelId="blog-form"
          horizontal={false}
          phoneField={false}
          onSuccessCallback={() => {
            setShowModal(false)
            setCookie('blogPopup', 'closed', 1)
          }}
        />
      </div>
    </Modal>
  )
}
