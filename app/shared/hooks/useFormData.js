'use client'
import { useState, createContext, useContext } from 'react'

const FormDataContext = createContext()

export const FormDataProvider = ({ children, initialState = {}, validator = () => true }) => {
  const [formData, setFormData] = useState(initialState)
  const [isValid, setIsValid] = useState(validator(initialState))

  const handleChange = (change) => {
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

export const useFormData = () => {
  const context = useContext(FormDataContext)
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider')
  }
  return context
} 