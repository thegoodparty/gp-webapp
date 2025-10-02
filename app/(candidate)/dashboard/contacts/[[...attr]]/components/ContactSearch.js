'use client'

import { Input } from 'goodparty-styleguide'
import { useState } from 'react'

export const ContactSearch = () => {
  const [searchText, setSearchText] = useState('')

  // TODO in follow-up:
  // - add a search icon
  // - hook up to API
  return (
    <Input
      className="max-w-md"
      placeholder="Search contacts by name or phone number"
      value={searchText}
      onChange={(e) => {
        setSearchText(e.target.value)
      }}
    />
  )
}
