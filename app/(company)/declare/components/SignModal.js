'use client'
import Modal from '@shared/utils/Modal'
import { useState } from 'react'
import PinkButtonClient from '@shared/buttons/PinkButtonClient'
import SignForm from './SignForm'

export default function SignModal({ tangerine, setSigner }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <PinkButtonClient
        className="py-3 px-4 mb-3 ml-3 font-bold text-white text-sm"
        style={{
          borderRadius: '9999px',
          padding: '0.625rem 1.25rem',
        }}
        onClick={() => setShowModal(true)}
      >
        SIGN NOW
      </PinkButtonClient>

      <Modal closeCallback={() => setShowModal(false)} open={showModal}>
        <div className="flex flex-col p-4 max-w-[465px] min-w-[300px]">
          <h3 className="text-xl font-black mb-9 flex items-center justify-center">
            <div className="ml-3">
              Leave your John Hancock and declare your independence!
            </div>
          </h3>
          <SignForm
            fullWidth
            formId="f51c1352-c778-40a8-b589-b911c31e64b1"
            pageName="Declare"
            label="SIGN NOW"
            labelId="signature-form"
            tangerine={tangerine}
            setSigner={setSigner}
          />
        </div>
      </Modal>
    </>
  )
}
