'use client'

import React, { createContext, useContext, useState } from 'react'

type FlexibleObject = { [key: string]: string | number | boolean | object | null | undefined }

export type Outreach = FlexibleObject

type OutreachContextValue = [Outreach[], React.Dispatch<React.SetStateAction<Outreach[]>>]

const noop = () => {}

export const outreachContext = createContext<OutreachContextValue>([
  [],
  noop as React.Dispatch<React.SetStateAction<Outreach[]>>,
])

interface OutreachProviderProps {
  initValue?: Outreach[]
  children: React.ReactNode
}

export const OutreachProvider = ({ initValue = [], children }: OutreachProviderProps): React.JSX.Element => {
  const [outreaches, setOutreaches] = useState<Outreach[]>(initValue)

  return (
    <outreachContext.Provider value={[outreaches, setOutreaches]}>
      {children}
    </outreachContext.Provider>
  )
}

export const useOutreach = (): OutreachContextValue => useContext(outreachContext)
