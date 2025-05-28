'use client'
import { useState } from 'react'
import Paper from '@shared/utils/Paper'
import Body1 from '@shared/typography/Body1'
import Button from '@shared/buttons/Button'
import H3 from '@shared/typography/H3'
import TextField from '@shared/inputs/TextField'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { useSnackbar } from 'helpers/useSnackbar'
import { useCampaign } from '@shared/hooks/useCampaign'

/**
 * Submits the PIN for the compliance process
 * @param {string} pin - The PIN to submit
 */
function submitCompliancePin(pin) {
  return clientFetch(apiRoutes.textMessaging.submitCompliancePin, {
    pin,
  })
}

export default function CompliancePin() {
  const [, , refreshCampaign] = useCampaign()
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const { errorSnackbar, successSnackbar } = useSnackbar()

  const handleSubmit = async () => {
    setLoading(true)
    const resp = await submitCompliancePin(pin)
    setLoading(false)

    if (resp.ok) {
      successSnackbar('PIN submitted successfully.')
    } else {
      errorSnackbar('Error submitting PIN. Please try again later.')
    }

    refreshCampaign()
  }

  return (
    <Paper>
      <div className="py-4 md:py-12 lg:py-24 flex flex-col items-center">
        <H3 className="mt-8 mb-4">Waiting for PIN confirmation</H3>
        <Body1 className="mb-8 max-w-lg text-center px-2">
          Your PIN will be sent to the email address you provided. Please check
          your email for confirmation. And input the PIN here to continue to the
          next step of the registration.
        </Body1>

        <TextField
          label="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          fullWidth
          required
          name="PIN"
        />

        <Button
          className="mt-4"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          Submit PIN
        </Button>
      </div>
    </Paper>
  )
}
