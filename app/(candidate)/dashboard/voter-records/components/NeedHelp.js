'use client'
import { InputLabel, MenuItem, Select } from '@mui/material'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import TextField from '@shared/inputs/TextField'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'
import { useState } from 'react'
import NeedHelpSuccess from './NeedHelpSuccess'
import Button from '@shared/buttons/Button'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export async function sendMessage(type, message) {
  try {
    const payload = {
      type,
      message,
    }
    return await clientFetch(apiRoutes.voters.voterFile.helpMessage, payload)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

const types = [
  'Direct Mail',
  'Door Knocking',
  'Texting',
  'Phone Banking',
  'Digital Advertising',
]

export default function NeedHelp() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, setState] = useState({
    type: '',
    message: '',
  })

  const handleChange = (key, value) => {
    setState({
      ...state,
      [key]: value,
    })
  }

  const handleClose = () => {
    trackEvent(EVENTS.VoterData.NeedHelp.Exit)
    setOpen(false)
    setLoading(false)
    setShowSuccess(false)
  }

  const canSave = () => {
    return !loading && state.type !== '' && state.message !== ''
  }

  const handleSubmit = async () => {
    if (loading) {
      return
    }
    trackEvent(EVENTS.VoterData.NeedHelp.Submit, {
      type: state.type,
      hasMessage: !!state.message,
    })
    setLoading(true)
    await sendMessage(state.type, state.message)
    setShowSuccess(true)
  }
  return (
    <>
      <Button
        size="large"
        color="neutral"
        onClick={() => {
          trackEvent(EVENTS.VoterData.ClickNeedHelp)
          setOpen(true)
        }}
        className="mr-4 mb-4 md:mb-0 w-full md:w-auto"
      >
        Need Help?
      </Button>
      <Modal closeCallback={handleClose} open={open}>
        <div className="w-[80vw] max-w-xl p-2 md:p-8">
          {showSuccess ? (
            <NeedHelpSuccess closeCallback={handleClose} />
          ) : (
            <form noValidate onSubmit={(e) => e.preventDefault()}>
              <div className=" text-center">
                <H1 className="mb-4">Voter File Help</H1>
              </div>
              <InputLabel id="type">Voter File Type *</InputLabel>
              <Select
                fullWidth
                labelId="type"
                value={state.type}
                displayEmpty
                required
                onChange={(e) => {
                  trackEvent(EVENTS.VoterData.NeedHelp.SelectType, {
                    type: e.target.value,
                  })
                  handleChange('type', e.target.value)
                }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <div>Select</div>
                  }
                  return selected
                }}
              >
                {types.map((option) => (
                  <MenuItem value={option} key={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <div className="mt-8">
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Tell us a bit about who you are trying to reach. Example: veterans ages 50-60"
                  label="Message"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={state.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                />
              </div>
              <div className="flex justify-between mt-12">
                <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                <PrimaryButton
                  type="submit"
                  disabled={!canSave()}
                  onClick={handleSubmit}
                >
                  Submit
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  )
}
