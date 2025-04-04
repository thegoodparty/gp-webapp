'use client'
import { createContext, useState } from 'react'

export const AcademySignUpModalContext = createContext({
  open: false,
  openModal: () => {},
  closeModal: () => {},
})
export const AcademySignUpModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  return (
    <AcademySignUpModalContext.Provider
      value={{
        open,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AcademySignUpModalContext.Provider>
  )
}
