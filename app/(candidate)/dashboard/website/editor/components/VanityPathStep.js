'use client'
import { useState, useRef, useEffect } from 'react'
import TextField from '@shared/inputs/TextField'
import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon'
import { validateVanityPath } from '../../util/website.util'
import Caption from './WebsiteEditorPageCaption'
import H2 from '@shared/typography/H2'
import Label from './Label'
import { getWebsiteUrl } from '../../util/website.util'

const DEBOUNCE_TIME = 500

export default function VanityPathStep({ website, onChange }) {
  const vanityPath = website.vanityPath
  const [validated, setValidated] = useState(true)
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef(null)
  const websiteUrl = getWebsiteUrl(website.vanityPath, false)

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
      <Label className="mt-6">Custom Link</Label>
      <TextField
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
      <Caption>{websiteUrl}</Caption>
    </>
  )
}
