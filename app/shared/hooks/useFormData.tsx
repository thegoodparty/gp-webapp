'use client'
import { createContext, useContext, useState } from 'react'

interface ValidationResult {
  validations: Partial<Record<string, string | boolean | null>>
  isValid: boolean
}

type FormDataValue = string | number | boolean | object | null
export type FormDataState = Partial<Record<string, FormDataValue>>

interface FormDataContextValue {
  formData: FormDataState
  handleChange: (change: FormDataState) => void
  isValid: ValidationResult
}

interface FormDataProviderProps {
  children: React.ReactNode
  initialState?: FormDataState
  validator?: (data: FormDataState) => ValidationResult
}

const FormDataContext = createContext<FormDataContextValue | null>(null)

export const FormDataProvider = ({
  children,
  initialState = {},
  validator = () => ({
    validations: {},
    isValid: true,
  }),
}: FormDataProviderProps): React.JSX.Element => {
  const [formData, setFormData] = useState<FormDataState>(initialState)
  const [isValid, setIsValid] = useState(validator(initialState))

  const handleChange = (change: FormDataState) => {
    const newFormData = { ...formData, ...change }
    const newIsValid = validator(newFormData)
    setFormData(newFormData)
    setIsValid(newIsValid)
  }

  return (
    <FormDataContext.Provider value={{ formData, handleChange, isValid }}>
      {children}
    </FormDataContext.Provider>
  )
}

export const useFormData = (): FormDataContextValue => {
  const context = useContext(FormDataContext)
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider')
  }
  return context
}
