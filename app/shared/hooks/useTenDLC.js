'use client'
import { useContext } from 'react'
import { TenDLCContext } from 'app/shared/hooks/TenDLCProvider'

export const useTenDLC = () => useContext(TenDLCContext)
