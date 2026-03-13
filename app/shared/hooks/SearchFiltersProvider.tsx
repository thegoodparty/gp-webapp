'use client'
import { createContext, useState } from 'react'
import { noop } from '@shared/utils/noop'

export interface SearchFilters {
  search?: string
  status?: string
}

type SearchFiltersContextValue = [
  filters: SearchFilters,
  setFilters: (filters: SearchFilters) => void,
]

export const SearchFiltersContext = createContext<SearchFiltersContextValue>([
  {},
  noop,
])

interface SearchFiltersProviderProps {
  children: React.ReactNode
  initFilters?: SearchFilters
}

export const SearchFiltersProvider = ({
  children,
  initFilters = {},
}: SearchFiltersProviderProps): React.JSX.Element => {
  const [filters, setFilters] = useState<SearchFilters>(initFilters)

  const contextValue: SearchFiltersContextValue = [filters, setFilters]

  return (
    <SearchFiltersContext.Provider value={contextValue}>
      {children}
    </SearchFiltersContext.Provider>
  )
}
