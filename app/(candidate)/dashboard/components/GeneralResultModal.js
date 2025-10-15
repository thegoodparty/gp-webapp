import { useState } from 'react'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import RadioList from '@shared/inputs/RadioList'
import Button from '@shared/buttons/Button'
import { useSnackbar } from 'helpers/useSnackbar'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'

export default function GeneralResultModal({
  open,
  officeName,
  electionDate,
  onClose,
}) {
  const { refreshElectedOffice } = useElectedOffice()
  const { errorSnackbar } = useSnackbar()
  const [result, setResult] = useState(null)
  const [requestState, setRequestState] = useState({
    loading: false,
    error: false,
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const options = [
    { key: 'won', label: 'I won my race' },
    { key: 'lost', label: 'I did not win my race' },
  ]

  const createElectedOffice = async () => {
    if (!electionDate) {
      throw new Error('Invalid election date')
    }

    const response = await clientFetch(apiRoutes.electedOffice.create, {
      electedDate: new Date(electionDate).toISOString().split('T')[0],
    })

    if (!response.ok) {
      throw new Error('Failed to create elected office')
    }
    refreshElectedOffice()
    return response.data
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setRequestState({ loading: true, error: false })
    try {
      const wonGeneral = result === 'won'

      await updateCampaign([{ key: 'details.wonGeneral', value: wonGeneral }])

      // Create ElectedOffice if the user won the election
      if (wonGeneral) {
        try {
          await createElectedOffice()
        } catch (electedOfficeError) {
          console.error('Error creating elected office:', electedOfficeError)
          // Don't fail the entire submission if elected office creation fails
          // Just log the error and continue
        }
      }

      trackEvent(EVENTS.Candidacy.CampaignCompleted, {
        winner: wonGeneral,
        officeElectionDate: electionDate,
        primary: false,
      })

      setFormSubmitted(true)
      setRequestState({ loading: false, error: false })
    } catch (e) {
      console.error('Error submitting General Result:', e)
      errorSnackbar('Failed to submit election result.')
      setRequestState({ loading: false, error: true })
    }
  }

  return (
    <Modal
      open={open}
      boxClassName="p-16 pt-0"
      preventEscClose
      preventBackdropClose
      hideClose
    >
      {!formSubmitted ? (
        <form onSubmit={handleSubmit} className="pt-16 max-w-[640px]">
          <H1 className="mb-4 text-center">
            Election Results:
            <br />
            {officeName}
          </H1>
          <Body2 className="mb-8 text-center">
            It looks like your general election date has passed. Please confirm
            the outcome of your election.
          </Body2>

          {!requestState.error ? (
            <RadioList
              options={options}
              selected={result}
              selectCallback={setResult}
            />
          ) : (
            <Body2 className="text-red text-center">
              An error occured when saving your election result, please try
              again later.
            </Body2>
          )}

          <div className="mt-12 flex gap-4 justify-center">
            <Button
              disabled={requestState.loading}
              onClick={() => onClose()}
              type="button"
              color="neutral"
              size="large"
              className="px-16"
            >
              Cancel
            </Button>
            <Button
              disabled={!result || requestState.loading || requestState.error}
              loading={requestState.loading}
              type="submit"
              size="large"
              className="px-16"
            >
              Submit
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <Button
            onClick={() => onClose(result === 'won')}
            size="large"
            className="w-full mt-8"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </Modal>
  )
}
