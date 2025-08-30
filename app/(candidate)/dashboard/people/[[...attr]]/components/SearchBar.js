'use client'
import { Input } from 'goodparty-styleguide'
import { useState } from 'react'
import { usePeople } from './PeopleProvider'
import Button from '@shared/buttons/Button'

export default function SearchBar() {
  const [value, setValue] = useState('')
  const [people] = usePeople()

  const handleSearchChange = (event) => {
    setValue(event.target.value)
  }

  const searchPlaceholder = `Search ${people?.pagination?.totalItems} constituents by name, email or phone number`
  return (
    <div className="md:relative z-10 md:max-w-lg md:-mb-12 flex items-center mt-4">
      <Input
        placeholder={searchPlaceholder}
        value={value}
        onChange={handleSearchChange}
        className="max-w-lg rounded-r-none"
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
