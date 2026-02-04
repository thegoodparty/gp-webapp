'use client'

import { Input } from 'goodparty-styleguide'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useShowContactProModal } from '../hooks/ContactProModal'
import { useContactsTable } from '../hooks/ContactsTableProvider'
import { LuSearch } from 'react-icons/lu'

export const ContactSearch = () => {
  const showProUpgradeModal = useShowContactProModal()
  const { searchTerm, searchContacts, canUseProFeatures } = useContactsTable()

  const [searchText, setSearchText] = useState<string>(searchTerm)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setSearchText(searchTerm)
  }, [searchTerm])

  const performSearch = useCallback(() => {
    if (!canUseProFeatures) {
      showProUpgradeModal(true)
      return
    }
    searchContacts(searchText)
  }, [canUseProFeatures, searchText, searchContacts, showProUpgradeModal])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (searchText === searchTerm) {
      return
    }

    timeoutRef.current = setTimeout(() => {
      performSearch()
    }, 1000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchText, performSearch, searchTerm])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      performSearch()
    }
  }

  return (
    <div className="relative w-full">
      <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
      <Input
        className="pl-9 w-full"
        placeholder="Search contacts"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
