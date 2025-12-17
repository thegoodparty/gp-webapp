'use client'
import { createContext, useState } from 'react'

interface AcademySignUpModalContextType {
  open: boolean
  openModal: () => void
  closeModal: () => void
}

export const AcademySignUpModalContext =
  createContext<AcademySignUpModalContextType>({
    open: false,
    openModal: () => {},
    closeModal: () => {},
  })

interface AcademySignUpModalProviderProps {
  children: React.ReactNode
}

export const AcademySignUpModalProvider = ({
  children,
}: AcademySignUpModalProviderProps): React.JSX.Element => {
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
