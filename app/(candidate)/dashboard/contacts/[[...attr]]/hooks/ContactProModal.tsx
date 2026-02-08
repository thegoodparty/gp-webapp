import { createContext, useContext } from 'react'

const Context = createContext<(show: boolean) => void>(() => {})

export const useShowContactProModal = (): ((show: boolean) => void) =>
  useContext(Context)

export const ContactProModalProvider = Context.Provider
