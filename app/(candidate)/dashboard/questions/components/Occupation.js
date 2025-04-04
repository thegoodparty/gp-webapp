'use client'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import TextField from '@shared/inputs/TextField'
import H1 from '@shared/typography/H1'

export default function Occupation({
  value,
  onChangeCallback,
  saveCallback,
  campaignKey,
}) {
  const handleSave = () => {
    if (!canSave()) return
    saveCallback([`details.${campaignKey}`], [value])
  }
  const canSave = () => {
    return value !== ''
  }
  return (
    <div>
      <H1 className="mb-10 text-center">What is your current occupation?</H1>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="max-w-md m-auto">
          <TextField
            required
            label="Occupation"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={value}
            onChange={(e) => {
              onChangeCallback(campaignKey, e.target.value)
            }}
          />
          <div className="flex justify-center mt-10" onClick={handleSave}>
            <PrimaryButton className="mt-3" disabled={!canSave()} type="submit">
              Next
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  )
}
