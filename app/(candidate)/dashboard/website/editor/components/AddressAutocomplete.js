import { useEffect, useRef, useState } from 'react'
import TextField from '@shared/inputs/TextField'
import Script from 'next/script'

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

export default function AddressAutocomplete({ value, onChange }) {
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)
  const [inputValue, setInputValue] = useState(value || '')
  const [mapsLoaded, setMapsLoaded] = useState(false)

  useEffect(() => {
    if (!mapsLoaded || !window.google || !inputRef.current) return

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current.querySelector('input'),
      {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      },
    )

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
      if (window.google && listener) {
        window.google.maps.event.removeListener(listener)
      }
    }
  }, [mapsLoaded, onChange])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
  }

  if (!MAPS_API_KEY) {
    console.warn('Google Maps API key is missing!')
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`}
        onReady={() => setMapsLoaded(true)}
      />
      <TextField
        ref={inputRef}
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
      />
    </>
  )
}
