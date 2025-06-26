import Button from '@shared/buttons/Button'
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput'
import TextField from '@shared/inputs/TextField'
import H2 from '@shared/typography/H2'
import Modal from '@shared/utils/Modal'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useState } from 'react'

const addEcanvasser = async (email, apiKey) => {
  try {
    const payload = {
      email,
      apiKey,
    }
    const resp = await clientFetch(apiRoutes.ecanvasser.create, payload)
    return resp.data
  } catch (e) {
    console.log('error addEcanvasser', e)
    return false
  }
}

export default function AddEcanvasser({ open, onClose, createCallback }) {
  const [email, setEmail] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await addEcanvasser(email, apiKey)
    createCallback()
    onClose()
    setIsLoading(false)
  }

  const isDisabled = !email || !apiKey || !isValidEmail(email)
  return (
    <Modal open={open} closeCallback={onClose}>
      <div className="p-4">
        <H2 className="mb-4">Add a new Ecanvasser</H2>
        <form onSubmit={handleSubmit}>
          <EmailInput
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="my-4"
          />
          <div className="my-2" />
          <TextField
            label="API Key"
            name="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            fullWidth
          />
          <br />
          <Button
            type="submit"
            className="w-full mt-8"
            disabled={isDisabled || isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </div>
    </Modal>
  )
}
