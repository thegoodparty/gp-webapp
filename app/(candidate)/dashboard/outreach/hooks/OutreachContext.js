import { createContext, useContext, useState } from 'react'

export const outreachContext = createContext([[], () => {}])

export const OutreachProvider = ({ initValue = [], children }) => {
  const [outreaches, setOutreaches] = useState(initValue)

  return (
    <outreachContext.Provider value={[outreaches, setOutreaches]}>
      {children}
    </outreachContext.Provider>
  )
}

export const useOutreach = () => useContext(outreachContext)
