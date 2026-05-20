'use client'
import { useContext } from 'react'
import { UserContext, UserContextValue } from '@shared/user/UserProvider'

export const useUser = (): UserContextValue => useContext(UserContext)
