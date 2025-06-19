import { useEffect, useRef, useState } from 'react'
import TextField from '@shared/inputs/TextField'

export default function AddressAutocomplete({
  value,
  onChange,
  label = 'Address',
}) {
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)
  const [inputValue, setInputValue] = useState(value || '')

  useEffect(() => {
    if (!window.google || !inputRef.current) return

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current.querySelector('input'),
      {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      },
    )

    // Add place_changed event listener
    const listener = autocompleteRef.current.addListener(
      'place_changed',
      () => {
        const place = autocompleteRef.current.getPlace()
        if (place.formatted_address) {
          setInputValue(place.formatted_address)
          onChange(place.formatted_address)
        }
      },
    )

    return () => {
      // Cleanup listener when component unmounts
      if (window.google) {
        window.google.maps.event.removeListener(listener)
      }
    }
  }, [onChange])

  // Handle manual input changes
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
  }

  return (
    <TextField
      ref={inputRef}
      label={label}
      fullWidth
      value={inputValue}
      onChange={handleInputChange}
      style={{ marginBottom: '16px' }}
      InputLabelProps={{ shrink: true }}
    />
  )
}
