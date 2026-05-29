'use client'
import React, { useEffect, useState, ChangeEvent } from 'react'
import TextField, { TextFieldProps } from '@shared/inputs/TextField'
import { noop } from '@shared/utils/noop'
import { usePlacesWidget } from 'react-google-autocomplete'
import { NEXT_PUBLIC_GOOGLE_MAPS_KEY } from 'appEnv'

const MAPS_API_KEY = NEXT_PUBLIC_GOOGLE_MAPS_KEY

interface GooglePlace {
  formatted_address?: string
  geometry?: google.maps.places.PlaceGeometry
  place_id?: string
  name?: string
}

interface AddressAutocompleteProps
  extends Omit<TextFieldProps<'outlined'>, 'value' | 'onChange' | 'onSelect'> {
  value?: string
  onChange?: (inputValue: string) => void
  onSelect?: (place: GooglePlace) => void
  dropdownClassName?: string
}

export default function AddressAutocomplete({
  value,
  onChange = noop,
  onSelect = noop,
  dropdownClassName,
  ...restProps
}: AddressAutocompleteProps): React.JSX.Element {
  const [inputValue, setInputValue] = useState(value || '')

  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: MAPS_API_KEY,
    onPlaceSelected: (place: GooglePlace) => {
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
    const addMobileClassToAutocomplete = (): void => {
      const pacContainers = document.querySelectorAll('.pac-container')
      pacContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.classList.add('needsclick')
          container.style.touchAction = 'manipulation'
        }
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

    return (): void => observer.disconnect()
  }, [])

  // Google appends the `.pac-container` dropdown to <body>, so it can't be
  // matched via this component's DOM subtree. Tag it only while this input is
  // focused (the only time its dropdown is visible) so a caller-supplied
  // `dropdownClassName` can't bleed into other AddressAutocomplete instances.
  useEffect(() => {
    const inputEl = ref.current
    if (!inputEl || !dropdownClassName) return

    const tagDropdown = (): void => {
      if (document.activeElement !== inputEl) return
      document.querySelectorAll('.pac-container').forEach((container) => {
        if (container instanceof HTMLElement) {
          container.classList.add(dropdownClassName)
        }
      })
    }

    const untagDropdown = (): void => {
      document.querySelectorAll('.pac-container').forEach((container) => {
        if (container instanceof HTMLElement) {
          container.classList.remove(dropdownClassName)
        }
      })
    }

    inputEl.addEventListener('focus', tagDropdown)
    inputEl.addEventListener('blur', untagDropdown)

    const observer = new MutationObserver(tagDropdown)
    observer.observe(document.body, { childList: true, subtree: true })

    return (): void => {
      inputEl.removeEventListener('focus', tagDropdown)
      inputEl.removeEventListener('blur', untagDropdown)
      observer.disconnect()
      untagDropdown()
    }
  }, [dropdownClassName, ref])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
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
