'use client'
import { useState, useRef, useEffect } from 'react'
import TextField from '@shared/inputs/TextField'
import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon'
import { validateVanityPath } from '../../util/website.util'
import Caption from './WebsiteEditorPageCaption'
import H2 from '@shared/typography/H2'
import Label from './Label'
import { getWebsiteUrl } from '../../util/website.util'
import { Website, Domain } from 'helpers/types'

const DEBOUNCE_TIME = 500

interface VanityPathStepProps {
  website: Website & { vanityPath?: string; domain?: Domain | null }
  onChange: (value: string) => void
  validateCallback: (valid: boolean) => void
}

export default function VanityPathStep({
  website,
  onChange,
  validateCallback,
}: VanityPathStepProps) {
  const vanityPath = website.vanityPath
  const [validated, setValidated] = useState(true)
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const websiteUrl = getWebsiteUrl(website.vanityPath, false, website.domain)

  function handleChange(value: string) {
    onChange(value)
    setLoading(true)
    setValidated(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      const resp = await validateVanityPath(value)
      setLoading(false)
      if (resp.ok && resp.data.valid) {
        setValidated(true)
        validateCallback(true)
      } else {
        setValidated(false)
        validateCallback(false)
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
      <Label className="mt-6">
        Custom Link <sup>*</sup>
      </Label>
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
