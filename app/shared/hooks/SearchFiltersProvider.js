'use client'
import { createContext, useState } from 'react'

export const SearchFiltersContext = createContext({
  filters: {},
  setFilters: () => {},
})

export function SearchFiltersProvider({ children }) {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  })

  const contextValue = [filters, setFilters]

  return (
    <SearchFiltersContext.Provider value={contextValue}>
      {children}
    </SearchFiltersContext.Provider>
  )
}
