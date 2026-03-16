'use client'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import TextField from '@shared/inputs/TextField'
import H1 from '@shared/typography/H1'
import { isValidUrl } from 'helpers/linkhelper'
import { ChangeEvent } from 'react'

interface WebsiteProps {
  value: string
  onChangeCallback: (key: string, value: string) => void
  saveCallback: (keys: string[], values: string[]) => void
  campaignKey: string
}

export default function Website({
  value,
  onChangeCallback,
  saveCallback,
  campaignKey,
}: WebsiteProps): React.JSX.Element {
  const handleSave = () => {
    if (!canSave()) return

    saveCallback([`details.${campaignKey}`], [value])
  }
  const canSave = () => {
    return isValidUrl(value)
  }

  const handleSkip = () => {
    saveCallback([`details.${campaignKey}`], ['skipped'])
  }
  return (
    <div className="max-w-xl m-auto">
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <H1 className="mb-10">Campaign Website</H1>
        <TextField
          required
          label="Website URL"
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChangeCallback(campaignKey, e.target.value)
          }}
          helperText="Please provide a full url starting with http"
        />
        <div className="flex justify-center mt-10" onClick={handleSave}>
          <PrimaryButton className="mt-3" disabled={!canSave()} type="submit">
            Next
          </PrimaryButton>
        </div>
      </form>
      <div
        role="button"
        tabIndex={0}
        className="flex justify-center mt-10 underline cursor-pointer"
        onClick={handleSkip}
        onKeyDown={(e) => e.key === 'Enter' && handleSkip()}
      >
        Skip for now
      </div>
    </div>
  )
}
