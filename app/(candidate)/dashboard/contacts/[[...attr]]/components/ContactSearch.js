'use client'

import SearchInput from 'app/(candidate)/dashboard/issues/components/search/SearchInput'
import { useState } from 'react'

export const ContactSearch = () => {
  const [searchText, setSearchText] = useState('')

  // TODO in follow-up:
  // - hook up to API
  return (
    <SearchInput
      fullWidth
      variant="standard"
      className="max-w-md"
      placeholder="Search contacts by name or phone number"
      value={searchText}
      onChange={(e) => {
        setSearchText(e.target.value)
      }}
    />
  )
}
