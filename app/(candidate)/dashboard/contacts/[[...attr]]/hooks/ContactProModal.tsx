import { createContext, useContext } from 'react'

const Context = createContext(() => {})

export const useShowContactProModal = (): ((show: boolean) => void) =>
  useContext(Context)

export const ContactProModalProvider = Context.Provider
