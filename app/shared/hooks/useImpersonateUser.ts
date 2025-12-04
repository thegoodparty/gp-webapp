'use client'
import { useContext } from 'react'
import { ImpersonateUserContext } from '@shared/user/ImpersonateUserProvider'

export const useImpersonateUser = () => useContext(ImpersonateUserContext)



