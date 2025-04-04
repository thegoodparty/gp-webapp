'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const Modal = dynamic(() => import('@shared/utils/Modal'))

export default function ScheduleModal({ calendar, btn }) {
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <div
        className={`text-sm  underline mt-1 cursor-pointer ${
          !btn && 'text-center'
        }`}
        onClick={handleOpenModal}
      >
        {btn ? btn : 'Book a Time'}
      </div>
      {showModal && (
        <Modal closeCallback={handleCloseModal} open>
          <div className="w-[80vw] max-w-[900px] h-[90vh]">
            <iframe src={calendar} width="100%" height="100%" />
          </div>
        </Modal>
      )}
    </>
  )
}
