'use client'
import { createContext, useContext, useState } from 'react'

const DEFAULT_FORM_DATA = {
  ein: '',
  name: '',
  address: '',
  website: '',
  email: '',
}

const ComplianceFormContext = createContext([DEFAULT_FORM_DATA, () => {}])

export const useComplianceForm = () => useContext(ComplianceFormContext)

export function ComplianceFormProvider({
  children,
  initialFormData = DEFAULT_FORM_DATA,
}) {
  const [complianceForm, setComplianceForm] = useState(initialFormData)

  return (
    <ComplianceFormContext.Provider value={[complianceForm, setComplianceForm]}>
      {children}
    </ComplianceFormContext.Provider>
  )
}
