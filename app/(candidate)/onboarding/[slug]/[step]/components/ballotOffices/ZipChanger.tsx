'use client'
import TextField from '@shared/inputs/TextField'
import Body1 from '@shared/typography/Body1'
import { useState, KeyboardEvent } from 'react'
import { validateZip } from 'app/(entrance)/login/components/LoginPage'
import Modal from '@shared/utils/Modal'
import H2 from '@shared/typography/H2'
import PrimaryButton from '@shared/buttons/PrimaryButton'

interface ZipChangerProps {
  zip: string
  updateZipCallback: (zip: string) => Promise<void>
  count: number
}

export default function ZipChanger({ zip, updateZipCallback, count }: ZipChangerProps) {
  const [editMode, setEditMode] = useState(false)
  const [updatedZip, setUpdatedZip] = useState(zip)
  const isValid = validateZip(updatedZip)

  const handleToggle = async () => {
    if (!editMode) {
      setEditMode(true)
    } else {
      if (isValid) {
        setEditMode(false)
        await updateZipCallback(updatedZip)
      }
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') handleToggle()
  }

  return (
    <div className="">
      <Body1 className="font-semibold">
        {count} Offices available in
        <span
          role="button"
          tabIndex={0}
          className="inline-block ml-2 text-purple-400 font-medium cursor-pointer underline"
          onClick={handleToggle}
          onKeyDown={handleKeyPress}
        >
          {updatedZip}
        </span>
      </Body1>
      <Modal open={editMode} closeCallback={handleToggle}>
        <H2 className="my-6">What Zip Code are you running in?</H2>
        <TextField
          value={updatedZip}
          fullWidth
          onChange={(e) => {
            setUpdatedZip(e.target.value)
          }}
          error={!isValid}
        />
        <div className="mt-6 text-center">
          <PrimaryButton onClick={handleToggle} disabled={!isValid}>
            Save
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  )
}
