'use client'
import { useEffect, useState } from 'react'
import TextField from '@shared/inputs/TextField'
import { usePlacesWidget } from 'react-google-autocomplete'
import { NEXT_PUBLIC_GOOGLE_MAPS_KEY } from 'appEnv'

const MAPS_API_KEY = NEXT_PUBLIC_GOOGLE_MAPS_KEY

export default function AddressAutocomplete({
  value,
  onChange = (inputValue) => {},
  onSelect = (place) => {},
  ...restProps
}) {
  const [inputValue, setInputValue] = useState(value || '')

  const { ref } = usePlacesWidget({
    apiKey: MAPS_API_KEY,
    onPlaceSelected: (place) => {
      if (place && place.formatted_address) {
        setInputValue(place.formatted_address)
        onSelect(place)
      }
    },
    options: {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      strictBounds: false,
      fields: ['formatted_address', 'geometry', 'place_id', 'name'],
    },
    libraries: ['places'],
  })

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  useEffect(() => {
    const addMobileClassToAutocomplete = () => {
      const pacContainers = document.querySelectorAll('.pac-container')
      pacContainers.forEach((container) => {
        container.classList.add('needsclick')
        container.style.touchAction = 'manipulation'
      })
    }

    const observer = new MutationObserver(() => {
      addMobileClassToAutocomplete()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    addMobileClassToAutocomplete()

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
  }

  if (!MAPS_API_KEY) {
    return (
      <TextField
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
        disabled
        placeholder="Google Maps API key missing"
      />
    )
  }

  return (
    <TextField
      fullWidth
      value={inputValue}
      onChange={handleInputChange}
      InputLabelProps={{ shrink: true }}
      placeholder="Enter your address"
      inputRef={ref}
      {...restProps}
    />
  )
}
