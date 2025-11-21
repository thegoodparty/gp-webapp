'use client'
import { createContext, useContext, useState } from 'react'

interface ValidationResult {
  validations: Record<string, never>
  isValid: boolean
}

interface FormDataContextValue<T> {
  formData: T
  handleChange: (change: Partial<T>) => void
  isValid: ValidationResult
}

const FormDataContext = createContext<FormDataContextValue<never> | null>(null)

interface FormDataProviderProps<T> {
  children: React.ReactNode
  initialState?: T
  validator?: (data: T) => ValidationResult
}

export const FormDataProvider = <T extends Record<string, never>>({
  children,
  initialState = {} as T,
  validator = () => ({
    validations: {},
    isValid: true,
  }),
}: FormDataProviderProps<T>): React.JSX.Element => {
  const [formData, setFormData] = useState<T>(initialState)
  const [isValid, setIsValid] = useState(validator(initialState))

  const handleChange = (change: Partial<T>) => {
    const newFormData = { ...formData, ...change }
    const newIsValid = validator(newFormData)
    setFormData(newFormData)
    setIsValid(newIsValid)
  }

  return (
    <FormDataContext.Provider value={{ formData, handleChange, isValid } as never}>
      {children}
    </FormDataContext.Provider>
  )
}

export const useFormData = <T extends Record<string, never>>(): FormDataContextValue<T> => {
  const context = useContext(FormDataContext)
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider')
  }
  return context as never
}

