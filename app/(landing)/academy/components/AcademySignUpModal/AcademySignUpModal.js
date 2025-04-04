'use client'
import Modal from '@shared/utils/Modal'
import HubSpotForm from '@shared/utils/HubSpotForm'
import { useAcademySignUpModalState } from './useAcademySignUpModalState'

const ACADEMY_SIGN_UP_FORM_ID = '28d49682-0766-4fca-98ba-22394f79ec45'
const ACADEMY_FORM_RENDER_DELAY = 500
export const AcademySignUpModal = () => {
  const { open, closeModal } = useAcademySignUpModalState()
  return (
    <Modal open={open} closeCallback={closeModal}>
      <HubSpotForm
        formId={ACADEMY_SIGN_UP_FORM_ID}
        renderFormDelay={ACADEMY_FORM_RENDER_DELAY}
      />
    </Modal>
  )
}
