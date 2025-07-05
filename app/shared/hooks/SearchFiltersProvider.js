'use client'
import { createContext, useState } from 'react'

export const SearchFiltersContext = createContext({
  filters: {},
  setFilters: () => {},
})

export function SearchFiltersProvider({ children, initFilters = {} }) {
  const [filters, setFilters] = useState(initFilters)

  const contextValue = [filters, setFilters]

  return (
    <SearchFiltersContext.Provider value={contextValue}>
      {children}
    </SearchFiltersContext.Provider>
  )
}
