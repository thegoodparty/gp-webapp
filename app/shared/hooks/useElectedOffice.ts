'use client'
import { useContext } from 'react'
import { ElectedOfficeContext } from '@shared/hooks/ElectedOfficeProvider'

export const useElectedOffice = () => {
  const [electedOffice, setElectedOffice, refreshElectedOffice] =
    useContext(ElectedOfficeContext)
  return { electedOffice, setElectedOffice, refreshElectedOffice }
}
