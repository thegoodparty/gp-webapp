import { createContext, useContext } from 'react'
import { noop } from '@shared/utils/noop'

const Context = createContext<(show: boolean) => void>(noop)

export const useShowContactProModal = (): ((show: boolean) => void) =>
  useContext(Context)

export const ContactProModalProvider = Context.Provider
