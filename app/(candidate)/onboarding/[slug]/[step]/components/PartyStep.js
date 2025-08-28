'use client'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import TextField from '@shared/inputs/TextField'
import Modal from '@shared/utils/Modal'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { useUser } from '@shared/hooks/useUser'
import { identifyUser } from '@shared/utils/analytics'
import RadioList from '@shared/inputs/RadioList'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'
import Button from '@shared/buttons/Button'

const options = [
  { key: 'independent', label: 'Independent' },
  { key: 'republican', label: 'Republican' },
  { key: 'democrat', label: 'Democrat' },
  { key: 'forward', label: 'Forward Party' },
  { key: 'libertarian', label: 'Libertarian' },
  { key: 'green', label: 'Green Party' },
  { key: 'nonpartisan', label: 'Nonpartisan' },
]

const invalidOptions = [
  'democrat',
  'democratic party',
  'dnc',
  'dem',
  'blue dog democrat',
  'progressive democrat',
  'liberal democrat',
  'democratic national committee',
  'dccc',
  'democratic congressional campaign committee',
  'blue state democrat',
  'dem',
  'democratic',
  'blue democrat',
  'dem caucus',
  'democratic caucus',
  'democratic primary',
  'dem primary',
  'democratic convention',
  'dem convention',
  'blue wave',
  'dem pac',
  'democratic pac',
  'dem super pac',
  'democratic super pac',
  'dem candidate',
  'democratic candidate',
  'state democrat',
  'local democrat',
  'county democrat',
  'district democrat',
  'dem committee',
  'democratic committee',
  'dem delegate',
  'democratic delegate',
  'dem platform',
  'democratic platform',
  'dem endorsement',
  'democratic endorsement',
  'dem policies',
  'democratic policies',
  'dem values',
  'democratic values',
  'dem voter',
  'democratic voter',
  'dem supporter',
  'democratic supporter',
  'dem activist',
  'democratic activist',
  'republican',
  'gop',
  'rnc',
  'rep',
  'grand old party',
  'republican party',
  'conservative republican',
  'right-wing republican',
  'republican national committee',
  'nrcc',
  'republican congressional campaign committee',
  'red state republican',
  'repub',
  'republican',
  'red republican',
  'rep caucus',
  'republican caucus',
  'republican primary',
  'rep primary',
  'republican convention',
  'rep convention',
  'red wave',
  'rep pac',
  'republican pac',
  'rep super pac',
  'republican super pac',
  'rep candidate',
  'republican candidate',
  'state republican',
  'local republican',
  'county republican',
  'district republican',
  'rep committee',
  'republican committee',
  'rep delegate',
  'republican delegate',
  'rep platform',
  'republican platform',
  'rep endorsement',
  'republican endorsement',
  'rep policies',
  'republican policies',
  'rep values',
  'republican values',
  'rep voter',
  'republican voter',
  'rep supporter',
  'republican supporter',
  'rep activist',
  'republican activist',
]

export default function PartyStep(props) {
  const { campaign, step } = props
  const router = useRouter()
  const [user] = useUser()
  const [state, setState] = useState({
    party: campaign?.details?.party || '',
    otherParty: campaign?.details?.otherParty || '',
  })
  const [showInvalidModal, setShowInvalidModal] = useState(false)
  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Onboarding Next Button', {
        step,
        party: state.party || 'other',
        otherParty: state.otherParty,
      }),
    [step, state.party, state.otherParty],
  )

  const onChangeField = (key, value) => {
    if (key === 'otherParty' && value !== '') {
      setState({
        ...state,
        otherParty: value,
        party: '',
      })
    } else {
      setState({
        ...state,
        [key]: value,
      })
    }
  }

  const canSubmit = () => {
    if (state.party !== '' && state.otherParty !== '') {
      return false
    }
    return state.party !== '' || state.otherParty !== ''
  }

  const handleSave = async () => {
    trackEvent(EVENTS.Onboarding.PartyStep.ClickSubmit, {
      step,
    })
    if (invalidOtherParty()) {
      setShowInvalidModal(true)
      onChangeField('otherParty', '')
      trackEvent('Invalid Party', {
        party: state.party,
      })
      return
    }
    if (canSubmit) {
      const currentStep = onboardingStep(campaign, step)
      const attr = [{ key: 'data.currentStep', value: currentStep }]
      if (state.otherParty === '') {
        attr.push({ key: 'details.party', value: state.party })
      } else {
        attr.push({ key: 'details.otherParty', value: state.otherParty })
      }

      await updateCampaign(attr)
      const affiliation = state.otherParty === '' ? state.party : state.otherParty
      trackEvent(EVENTS.Onboarding.PartyStep.Completed, {
        affiliation,
      })
      if (user?.id) {
        await identifyUser(user.id, { affiliation })
      }
      router.push(`/onboarding/${campaign.slug}/${step + 1}`)
    }
  }

  const invalidOtherParty = () => {
    return (
      state.party === 'republican' ||
      state.party === 'democrat' ||
      (state.otherParty !== '' &&
        invalidOptions.includes(state.otherParty.toLowerCase()))
    )
  }

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col text-center py-12">
        <H1>How will your campaign appear on the ballot?</H1>
        <Body1 className="mt-8 mb-10">
          This is your campaign&apos;s affiliation, not how you lean politically
          or how you are registered to vote. We only support candidates running
          in nonpartisan races or candidates running as independent or
          third-party in a partisan election.
        </Body1>
        <div className="w-full max-w-md">
          <RadioList
            options={options}
            selected={state.party}
            selectCallback={(selected) => onChangeField('party', selected)}
          />

          <div className="mt-10">
            <TextField
              label="Other"
              fullWidth
              value={state.otherParty}
              onChange={(e) => onChangeField('otherParty', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>
        <div className="mt-10">
          <Button
            onClick={handleSave}
            disabled={!canSubmit()}
            type="submit"
            size="large"
            {...trackingAttrs}
          >
            Next
          </Button>
        </div>
      </div>
      {showInvalidModal && (
        <Modal open closeCallback={() => setShowInvalidModal(false)}>
          <div className="my-5 text-2xl text-center">
            We only support candidates
            <br />
            outside of the Two Party system.
          </div>
          <div className="mt-10 flex items-center justify-center">
            <Button
              className="mr-4"
              size="large"
              color="neutral"
              onClick={() => setShowInvalidModal(false)}
            >
              <div className="px-6 ">Okay</div>
            </Button>
            <Button href="/about" size="large">
              <div className="px-6 ">Learn more</div>
            </Button>
          </div>
        </Modal>
      )}
    </form>
  )
}
