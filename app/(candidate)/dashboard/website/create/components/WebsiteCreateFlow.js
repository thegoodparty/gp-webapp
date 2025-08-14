'use client'
import { useEffect, useMemo, useState } from 'react'
import Button from '@shared/buttons/Button'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import WebsitePreview from '../../editor/components/WebsitePreview'
import WebsiteEditorPageStepper from '../../editor/components/WebsiteEditorPageStepper'
import VanityPathStep from '../../editor/components/VanityPathStep'
import LogoStep from '../../editor/components/LogoStep'
import ThemeStep from '../../editor/components/ThemeStep'
import HeroStep from '../../editor/components/HeroStep'
import AboutStep from '../../editor/components/AboutStep'
import ContactStep from '../../editor/components/ContactStep'
import CompleteStep from '../../editor/components/CompleteStep'
import { useSnackbar } from 'helpers/useSnackbar'
import { updateWebsite, WEBSITE_STATUS } from '../../util/website.util'
import { useWebsite } from '../../components/WebsiteProvider'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { isValidEmail } from 'helpers/validations'
import { isValidPhone } from '@shared/inputs/PhoneInput'

const COMPLETE_STEP = 'complete'
const NUM_STEPS = 6

export default function WebsiteCreateFlow({ initialIssues }) {
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const { website, setWebsite } = useWebsite()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [updatedPlace, setUpdatedPlace] = useState(null)

  useEffect(() => {
    if (
      website?.content?.createStep &&
      website.content.createStep !== COMPLETE_STEP
    ) {
      const parsedStep = parseInt(website.content.createStep, 10)
      if (!isNaN(parsedStep) && parsedStep !== step) {
        setStep(parsedStep)
      }
    }
  }, [website?.content?.createStep])

  async function handleSaveAndExit() {
    const saved = await handleSave()

    if (saved) {
      window.location.href = '/dashboard/website'
    }
  }

  async function handleComplete() {
    const saved = await handleSave(true)

    if (saved) {
      trackEvent(EVENTS.CandidateWebsite.Published)
      setStep(COMPLETE_STEP)
      successSnackbar('Your website has been published')
    } else {
      errorSnackbar('Failed to publish website')
    }
  }

  async function handleSave(publish = false) {
    setSaveLoading(true)
    const resp = await updateWebsite({
      ...website.content,
      status: publish ? WEBSITE_STATUS.published : website.status,
      vanityPath: website.vanityPath,
      createStep: publish ? COMPLETE_STEP : step,
    })
    if (updatedPlace) {
      await updateCampaign([
        { key: 'formattedAddress', value: updatedPlace.formatted_address },
        { key: 'placeId', value: updatedPlace.place_id },
      ])
    }
    setSaveLoading(false)
    if (resp.ok) {
      setWebsite(resp.data)
    } else {
      console.error('Failed to save website', resp)
      errorSnackbar('Failed to save website')
    }

    return resp.ok
  }

  function handleStepChange(newStep) {
    setStep(newStep)
  }

  function handleVanityPathChange(value) {
    setWebsite((current) => ({
      ...current,
      vanityPath: value,
    }))
  }

  function handleLogoChange(file) {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogo(reader.result, file)
      reader.readAsDataURL(file)
    } else {
      setLogo(null, undefined)
    }

    function setLogo(url, file) {
      setWebsite((current) => ({
        ...current,
        content: {
          ...current.content,
          logo: url,
          logoFile: file,
        },
      }))
    }
  }

  function handleThemeChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        theme: value,
      },
    }))
  }

  function handleTitleChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        main: { ...current.content.main, title: value },
      },
    }))
    if (value.length > 0) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  function handleTaglineChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        main: { ...current.content.main, tagline: value },
      },
    }))
  }

  function handleHeroChange(file) {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setHero(reader.result, file)
      reader.readAsDataURL(file)
    } else {
      setHero(null, undefined)
    }

    function setHero(url, file) {
      setWebsite((current) => ({
        ...current,
        content: {
          ...current.content,
          main: { ...current.content.main, image: url },
          heroFile: file,
        },
      }))
    }
  }

  function handleBioChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        about: { ...current.content.about, bio: value },
      },
    }))
  }

  function handleIssuesChange(issues) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        about: { ...current.content.about, issues },
      },
    }))
  }

  async function handleAddressSelect(place) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        contact: {
          ...current.content.contact,
          address: place.formatted_address,
        },
      },
    }))

    if (place.formatted_address && place.place_id) {
      setUpdatedPlace(place)
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  function handleAddressChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        contact: { ...current.content.contact, addressText: value },
      },
    }))
  }

  function handleEmailChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        contact: { ...current.content.contact, email: value },
      },
    }))
    if (isValidEmail(value)) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  function handlePhoneChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        contact: { ...current.content.contact, phone: value },
      },
    }))
    if (isValidPhone(value)) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  function handleCommitteeChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        about: { ...current.content.about, committee: value },
      },
    }))
  }

  const initialBio = useMemo(
    () => website?.content?.about?.bio || '',
    [website?.id],
  )

  function validateCallback(value) {
    setIsValid(value)
  }

  const canPublish =
    isValidEmail(website.content.contact?.email) &&
    isValidPhone(website.content.contact?.phone) &&
    website.content.main?.title != '' &&
    website.vanityPath != '' &&
    website.content?.contact?.addressText != ''

  return (
    <>
      <div className="flex flex-col gap-4 h-full min-h-full">
        <div className="flex justify-between items-center">
          {step === COMPLETE_STEP ? (
            <Button variant="outlined" href="/dashboard/website">
              {step === COMPLETE_STEP ? 'Done' : 'Exit'}
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleSaveAndExit}
              disabled={saveLoading}
              loading={saveLoading}
            >
              Save &amp; Exit
            </Button>
          )}
          <Button
            className="block lg:hidden"
            variant="outlined"
            onClick={() => setPreviewOpen(true)}
          >
            Preview
          </Button>
        </div>
        <div className="grow overflow-auto p-4 py-6 lg:grid lg:grid-cols-2 lg:gap-24 lg:px-12 lg:items-center">
          <div className={`${step === COMPLETE_STEP ? 'lg:col-span-2' : ''}`}>
            {step === 1 && (
              <VanityPathStep
                website={website}
                onChange={handleVanityPathChange}
                validateCallback={validateCallback}
              />
            )}

            {step === 2 && (
              <LogoStep
                logo={website.content.logo}
                onChange={handleLogoChange}
              />
            )}

            {step === 3 && (
              <ThemeStep
                theme={website.content.theme}
                onChange={handleThemeChange}
              />
            )}

            {step === 4 && (
              <HeroStep
                title={website.content.main?.title}
                tagline={website.content.main?.tagline}
                image={website.content.main?.image}
                onTitleChange={handleTitleChange}
                onTaglineChange={handleTaglineChange}
                onImageChange={handleHeroChange}
              />
            )}

            {step === 5 && (
              <AboutStep
                initialBio={initialBio}
                bio={website.content.about?.bio}
                issues={website.content.about?.issues}
                onBioChange={handleBioChange}
                onIssuesChange={handleIssuesChange}
                initialIssues={initialIssues}
              />
            )}

            {step === 6 && (
              <ContactStep
                address={website.content.contact?.address}
                email={website.content.contact?.email}
                phone={website.content.contact?.phone}
                onAddressSelect={handleAddressSelect}
                onAddressChange={handleAddressChange}
                onEmailChange={handleEmailChange}
                onPhoneChange={handlePhoneChange}
                committee={website.content.about?.committee}
                onCommitteeChange={handleCommitteeChange}
              />
            )}
            {step === COMPLETE_STEP && (
              <CompleteStep
                vanityPath={website.vanityPath}
                domain={website.domain}
              />
            )}
          </div>
          {step !== COMPLETE_STEP && (
            <div className="hidden lg:block h-[60vh]">
              <WebsitePreview website={website} zoomScale={0.5} step={step} />
            </div>
          )}
        </div>
        {step !== COMPLETE_STEP && (
          <WebsiteEditorPageStepper
            totalSteps={NUM_STEPS}
            currentStep={step}
            onStepChange={handleStepChange}
            onComplete={handleComplete}
            completeLabel="Publish website"
            completeLoading={saveLoading}
            nextDisabled={!isValid}
            canPublish={canPublish}
          />
        )}
      </div>
      <ResponsiveModal
        fullSize
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      >
        <WebsitePreview
          website={website}
          className="min-w-[60vw]"
          step={step}
        />
      </ResponsiveModal>
    </>
  )
}
