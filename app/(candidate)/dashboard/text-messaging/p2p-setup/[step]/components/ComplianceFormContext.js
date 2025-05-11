'use client'
import { createContext, useContext, useState, useEffect, useRef } from 'react'

const COMPLIANCE_FORM_STORAGE_KEY = 'tcrComplianceFormData'

const DEFAULT_FORM_DATA = {
  ein: '',
  name: '',
  address: '',
  website: '',
  email: '',
}

const getLocalData = () => {
  if (typeof window === 'undefined') return

  try {
    const storedData = localStorage.getItem(COMPLIANCE_FORM_STORAGE_KEY)
    if (!storedData) return

    return JSON.parse(storedData)
  } catch (error) {
    console.error('Error loading local compliance form data:', error)
    localStorage.removeItem(COMPLIANCE_FORM_STORAGE_KEY)
    return
  }
}

export const clearLocalComplianceFormData = () => {
  localStorage.removeItem(COMPLIANCE_FORM_STORAGE_KEY)
}

const ComplianceFormContext = createContext([DEFAULT_FORM_DATA, () => {}])

export const useComplianceForm = () => useContext(ComplianceFormContext)

export function ComplianceFormProvider({ children, initialFormData }) {
  const hasInitialized = useRef(false)
  const [complianceForm, setComplianceForm] = useState(DEFAULT_FORM_DATA)

  useEffect(() => {
    // initialize with local data if it exists
    if (hasInitialized.current) return

    const localData = getLocalData()
    if (localData) {
      setComplianceForm(localData)
    } else if (initialFormData) {
      setComplianceForm(initialFormData)
    }

    hasInitialized.current = true
  }, [initialFormData])

  useEffect(() => {
    if (!hasInitialized.current) return

    localStorage.setItem(
      COMPLIANCE_FORM_STORAGE_KEY,
      JSON.stringify(complianceForm),
    )
  }, [complianceForm])

  return (
    <ComplianceFormContext.Provider value={[complianceForm, setComplianceForm]}>
      {children}
    </ComplianceFormContext.Provider>
  )
}
