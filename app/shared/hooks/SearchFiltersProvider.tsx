'use client'
import { createContext, useState } from 'react'

interface SearchFilters {
}

type SearchFiltersContextValue = [
  filters: SearchFilters,
  setFilters: (filters: SearchFilters) => void
]

export const SearchFiltersContext = createContext<SearchFiltersContextValue>([
  {},
  () => {},
])

interface SearchFiltersProviderProps {
  children: React.ReactNode
  initFilters?: SearchFilters
}

export const SearchFiltersProvider = ({ children, initFilters = {} }: SearchFiltersProviderProps): React.JSX.Element => {
  const [filters, setFilters] = useState<SearchFilters>(initFilters)

  const contextValue: SearchFiltersContextValue = [filters, setFilters]

  return (
    <SearchFiltersContext.Provider value={contextValue}>
      {children}
    </SearchFiltersContext.Provider>
  )
}

