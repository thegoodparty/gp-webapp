import { createContext, useContext } from 'react'

const Context = createContext(() => {})

export const useShowContactProModal = () => useContext(Context)

export const ContactProModalProvider = Context.Provider
