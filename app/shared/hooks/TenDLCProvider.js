import { createContext, useState } from 'react'

export const TenDLCContext = createContext([undefined, () => {}])

export function TenDLCProvider({ children, compliance: initialCompliance }) {
  const [compliance, setCompliance] = useState(initialCompliance)

  return (
    <TenDLCContext.Provider value={[compliance, setCompliance]}>
      {children}
    </TenDLCContext.Provider>
  )
} 