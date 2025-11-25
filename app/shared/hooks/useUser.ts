'use client'
import { useContext } from 'react'
import { UserContext } from '@shared/user/UserProvider'

export const useUser = () => useContext(UserContext)

