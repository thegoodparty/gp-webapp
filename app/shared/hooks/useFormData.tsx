'use client'
import { createContext, useContext, useState } from 'react'

interface ValidationResult {
  validations: Partial<Record<string, string>>
  isValid: boolean
}

interface FormDataContextValue<T> {
  formData: T
  handleChange: (change: Partial<T>) => void
  isValid: ValidationResult
}

interface FormDataProviderProps<T> {
  children: React.ReactNode
  initialState?: T
  validator?: (data: T) => ValidationResult
}

const FormDataContext = createContext<{
  formData: Partial<Record<string, string | number | boolean>>
  handleChange: (change: Partial<Record<string, string | number | boolean>>) => void
  isValid: ValidationResult
} | null>(null)

export const FormDataProvider = <T extends Partial<Record<string, string | number | boolean>>>({
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
    <FormDataContext.Provider value={{ formData: formData as Partial<Record<string, string | number | boolean>>, handleChange: handleChange as (change: Partial<Record<string, string | number | boolean>>) => void, isValid }}>
      {children}
    </FormDataContext.Provider>
  )
}

export const useFormData = <T extends Partial<Record<string, string | number | boolean>>>(): FormDataContextValue<T> => {
  const context = useContext(FormDataContext)
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider')
  }
  return {
    formData: context.formData as T,
    handleChange: context.handleChange as (change: Partial<T>) => void,
    isValid: context.isValid,
  }
}

