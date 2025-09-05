'use client'
import { Input } from 'goodparty-styleguide'
import { useState } from 'react'
import { useContacts } from '../providers/ContactsProvider'
import Button from '@shared/buttons/Button'

export default function SearchBar() {
  const [value, setValue] = useState('')
  const [people] = useContacts()

  const handleSearchChange = (event) => {
    setValue(event.target.value)
  }

  const searchPlaceholder = `Search ${people?.pagination?.totalItems} constituents by name, email or phone number`
  return (
    <div className="md:relative z-10 max-w-lg md:max-w-md xl:max-w-lg md:-mb-14 flex items-center mt-4">
      <Input
        placeholder={searchPlaceholder}
        value={value}
        onChange={handleSearchChange}
        className="w-full rounded-r-none"
      />
      <Button
        size="small"
        color="neutral"
        className="rounded-l-none ml-2"
        disabled={!value}
      >
        Search
      </Button>
    </div>
  )
}
