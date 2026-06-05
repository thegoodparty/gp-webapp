'use client'
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@styleguide'
import TextField from '@shared/inputs/TextField'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'
import { useState } from 'react'
import NeedHelpSuccess from './NeedHelpSuccess'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

interface MessagePayload {
  type: string
  message: string
}

interface MessageResponse {
  success?: boolean
}

export async function sendMessage(
  type: string,
  message: string,
): Promise<boolean> {
  try {
    const payload: MessagePayload = {
      type,
      message,
    }
    await clientFetch<MessageResponse>(
      apiRoutes.voters.voterFile.helpMessage,
      payload,
    )
    return true
  } catch (e) {
    console.error('error', e)
    return false
  }
}

const types: string[] = [
  'Direct Mail',
  'Door Knocking',
  'Texting',
  'Phone Banking',
  'Digital Advertising',
]

interface FormState {
  type: string
  message: string
}

export default function NeedHelp(): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const [state, setState] = useState<FormState>({
    type: '',
    message: '',
  })

  const handleChange = (key: keyof FormState, value: string): void => {
    setState({
      ...state,
      [key]: value,
    })
  }

  const handleClose = (): void => {
    trackEvent(EVENTS.VoterData.NeedHelp.Exit)
    setOpen(false)
    setLoading(false)
    setShowSuccess(false)
  }

  const canSave = (): boolean => {
    return !loading && state.type !== '' && state.message !== ''
  }

  const handleSubmit = async (): Promise<void> => {
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
        variant="secondary"
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
              <Label htmlFor="type" className="mb-1 block">
                Voter File Type *
              </Label>
              <Select
                value={state.type}
                required
                onValueChange={(value) => {
                  trackEvent(EVENTS.VoterData.NeedHelp.SelectType, {
                    type: value,
                  })
                  handleChange('type', value)
                }}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((option) => (
                    <SelectItem value={option} key={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
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
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!canSave()}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  )
}
