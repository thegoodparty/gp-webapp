import { useState } from 'react'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import Modal from '@shared/utils/Modal'
import Button from '@shared/buttons/Button'
import { useSnackbar } from 'helpers/useSnackbar'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'
import { LuTrophy, LuMeh, LuFrown, LuArrowRight } from 'react-icons/lu'

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
    { key: 'won', label: 'I won my race', icon: <LuTrophy size={24} /> },
    {
      key: 'lost',
      label: 'I lost my race',
      icon: <LuFrown size={24} />,
    },
    {
      key: 'neither',
      label: 'Neither, I am in a run-off election',
      icon: <LuMeh size={24} />,
    },
  ]

  const onSelectResult = (result) => {
    setResult(result)
  }

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
      boxClassName="p-16 pt-0 w-[320px] md:w-[700px]"
      preventEscClose
      preventBackdropClose
      hideClose
    >
      {!formSubmitted ? (
        <form
          onSubmit={handleSubmit}
          className="pt-4 md:pt-16 pb-8 max-w-[450px] mx-auto"
        >
          <h1
            id="election-results-heading"
            className="text-center font-semibold text-2xl md:text-4xl w-full"
          >
            Election Results:
            <br />
            {officeName}
          </h1>
          <p className="text-center mt-4 text-lg font-normal text-muted-foreground w-full">
            It looks like your general election date has passed. Please confirm
            the outcome of your election.
          </p>

          {!requestState.error ? (
            <div
              className="flex flex-col gap-4 mt-8"
              role="radiogroup"
              aria-labelledby="election-results-heading"
            >
              {options.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className="flex items-center gap-4 cursor-pointer p-6 rounded-xl border border-base hover:bg-gray-50 text-left w-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setResult(option.key)}
                  aria-pressed={result === option.key}
                  aria-label={option.label}
                >
                  <div className="flex items-center gap-5 pointer-events-none">
                    {option.icon}
                    <span className="font-bold text-foreground">
                      {option.label}
                    </span>
                  </div>
                  <LuArrowRight
                    className="ml-auto pointer-events-none"
                    size={20}
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-red text-center">
              An error occured when saving your election result, please try
              again later.
            </p>
          )}
          {/* 
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
          </div> */}
        </form>
      ) : (
        <div className="text-center">
          <Button
            onClick={() => onClose(result === 'won')}
            size="large"
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </Modal>
  )
}
