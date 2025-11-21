'use client'
import { createContext, useState } from 'react'

type SearchFiltersContextValue = [
  filters: Record<string, never>,
  setFilters: (filters: Record<string, never>) => void
]

export const SearchFiltersContext = createContext<SearchFiltersContextValue>([
  {},
  () => {},
])

interface SearchFiltersProviderProps {
  children: React.ReactNode
  initFilters?: Record<string, never>
}

export const SearchFiltersProvider = ({ children, initFilters = {} }: SearchFiltersProviderProps): React.JSX.Element => {
  const [filters, setFilters] = useState<Record<string, never>>(initFilters)

  const contextValue: SearchFiltersContextValue = [filters, setFilters]

  return (
    <SearchFiltersContext.Provider value={contextValue}>
      {children}
    </SearchFiltersContext.Provider>
  )
}

