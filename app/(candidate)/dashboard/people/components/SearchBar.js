'use client'
import { Input } from 'goodparty-styleguide'
import { useState } from 'react'
import { usePeople } from './PeopleProvider'

export default function SearchBar() {
  const [value, setValue] = useState('')
  const [people] = usePeople()

  const handleSearchChange = (event) => {
    setValue(event.target.value)
  }

  const searchPlaceholder = `Search ${people?.pagination?.totalItems} constituents by name, email or phone number`
  return (
    <div className="-mb-12">
      <Input
        placeholder={searchPlaceholder}
        value={value}
        onChange={handleSearchChange}
        className="max-w-lg mt-4"
      />
    </div>
  )
}
