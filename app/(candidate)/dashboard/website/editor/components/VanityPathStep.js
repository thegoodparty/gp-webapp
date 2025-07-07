'use client'
import { useState, useRef, useEffect } from 'react'
import TextField from '@shared/inputs/TextField'
import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon'
import { validateVanityPath } from '../../util/website.util'
import Caption from './Caption'
import H2 from '@shared/typography/H2'

const DEBOUNCE_TIME = 500

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE || 'goodparty.org'

export default function VanityPathStep({ vanityPath, onChange }) {
  const [validated, setValidated] = useState(true)
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef(null)

  function handleChange(value) {
    onChange(value)
    setLoading(true)
    setValidated(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      const resp = await validateVanityPath(value)
      setLoading(false)
      if (resp.ok && resp.data.available) {
        setValidated(true)
      } else {
        setValidated(false)
      }
    }, DEBOUNCE_TIME)
  }

  useEffect(() => {
    // just a cleanup effect
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <H2 className="mb-6">What do you want your custom link to be?</H2>
      <TextField
        label="Custom Link"
        placeholder="Enter your custom link"
        fullWidth
        required
        value={vanityPath}
        onChange={(e) => handleChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <AsyncValidationIcon
              message="Custom link must be unique"
              loading={loading}
              validated={validated}
            />
          ),
        }}
      />
      <Caption>
        {BASE_URL}/c/{vanityPath}
      </Caption>
    </>
  )
}
