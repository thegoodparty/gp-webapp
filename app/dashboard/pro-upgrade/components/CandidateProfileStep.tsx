'use client'

import { Button } from '@styleguide'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import { useCandidateProfileForm } from 'app/dashboard/profile/texting-compliance/candidate-profile/useCandidateProfileForm'
import CandidateProfileFields from 'app/dashboard/profile/texting-compliance/candidate-profile/components/CandidateProfileFields'
import { useProUpgradeWizard } from './ProUpgradeWizard'

// The candidate-profile wizard step. Mounts the shared candidate-profile form
// (bio + policy priorities) rather than forking it: the bio-length and
// policy-count validators live in `candidateProfile.utils` and the save path is
// `useCandidateProfileForm`, both shared with the standalone profile page. On a
// valid save it advances to the payment step. The campaign image from the Figma
// is intentionally not collected here — it comes from BallotReady via gp-api and
// is never asked of the candidate (ENG-10332 product decision).
const CandidateProfileStep = (): React.JSX.Element => {
  const { goToNextStep } = useProUpgradeWizard()
  const form = useCandidateProfileForm({
    onSaved: goToNextStep,
    trackViewEvent: true,
  })

  return (
    <div>
      <H2 className="mb-2">What is your campaign about?</H2>
      <Body2 className="text-secondary mb-8">
        We need to submit your candidate profile to register your campaign.
        Please be as descriptive as possible to ensure your profile is approved.
      </Body2>

      <CandidateProfileFields form={form} />

      <div className="mt-8 flex justify-end">
        <Button
          size="large"
          onClick={() => void form.handleSubmit()}
          loading={form.submitting}
          loadingText="Saving"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default CandidateProfileStep
