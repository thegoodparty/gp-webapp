'use client'
import React, { useEffect, useMemo, useState } from 'react'
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
import { Website, WebsiteIssue } from 'helpers/types'

interface WebsiteCreateFlowProps {
  initialIssues?: WebsiteIssue[]
}

interface GooglePlace {
  formatted_address?: string
  place_id?: string
}

const COMPLETE_STEP = 'complete'
const NUM_STEPS = 6

export const cantSaveReasons = (website: Website | null): string => {
  let cantSaveReason = ''
  if (!website) {
    return 'No website'
  }
  if (!isValidEmail(website.content?.contact?.email || '')) {
    cantSaveReason = 'Invalid email'
  } else if (!isValidPhone(website.content?.contact?.phone || '')) {
    cantSaveReason = 'Invalid phone'
  } else if (website.content?.main?.title == '') {
    cantSaveReason = 'Missing title'
  } else if (website.vanityPath == '') {
    cantSaveReason = 'Missing vanity path'
  }
  return cantSaveReason
}

export default function WebsiteCreateFlow({
  initialIssues,
}: WebsiteCreateFlowProps): React.JSX.Element {
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const { website, setWebsite } = useWebsite()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [step, setStep] = useState<number | typeof COMPLETE_STEP>(1)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [updatedPlace, setUpdatedPlace] = useState<GooglePlace | null>(null)

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

  async function handleSaveAndExit(): Promise<void> {
    const saved = await handleSave()

    if (saved) {
      window.location.href = '/dashboard/website'
    }
  }

  async function handleComplete(): Promise<void> {
    const saved = await handleSave(true)

    if (saved) {
      trackEvent(EVENTS.CandidateWebsite.Published)
      setStep(COMPLETE_STEP)
      successSnackbar('Your website has been published')
    } else {
      errorSnackbar('Failed to publish website')
    }
  }

  async function handleSave(publish = false): Promise<boolean> {
    if (!website) return false
    setSaveLoading(true)
    const resp = await updateWebsite({
      ...website.content,
      status: publish ? WEBSITE_STATUS.published : website.status,
      vanityPath: website.vanityPath,
      createStep: publish ? COMPLETE_STEP : String(step),
    })
    if (updatedPlace) {
      await updateCampaign([
        { key: 'formattedAddress', value: updatedPlace.formatted_address },
        { key: 'placeId', value: updatedPlace.place_id },
      ])
    }
    setSaveLoading(false)
    if (resp && resp.ok) {
      setWebsite(resp.data)
      return true
    } else {
      console.error('Failed to save website', resp)
      errorSnackbar('Failed to save website')
      return false
    }
  }

  function handleStepChange(newStep: number): void {
    setStep(newStep)
  }

  function handleVanityPathChange(value: string): void {
    setWebsite((current) =>
      current
        ? {
            ...current,
            vanityPath: value,
          }
        : null,
    )
  }

  function handleLogoChange(file: File | null): void {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogo(reader.result, file)
      reader.readAsDataURL(file)
    } else {
      setLogo(null, undefined)
    }

    function setLogo(
      url: string | ArrayBuffer | null,
      file: File | undefined,
    ): void {
      setWebsite((current) =>
        current
          ? {
              ...current,
              content: {
                ...current.content,
                logo: typeof url === 'string' ? url : undefined,
                logoFile: file,
              },
            }
          : null,
      )
    }
  }

  function handleThemeChange(color: string): void {
    setWebsite((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              theme: color,
            },
          }
        : null,
    )
  }

  function handleTitleChange(value: string): void {
    setWebsite((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              main: { ...current.content?.main, title: value },
            },
          }
        : null,
    )
    setIsValid(value.length > 0)
  }

  function handleTaglineChange(value: string): void {
    setWebsite((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              main: { ...current.content?.main, tagline: value },
            },
          }
        : null,
    )
  }

  function handleHeroChange(file: File | null): void {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setHero(reader.result, file)
      reader.readAsDataURL(file)
    } else {
      setHero(null, undefined)
    }

    function setHero(
      url: string | ArrayBuffer | null,
      file: File | undefined,
    ): void {
      setWebsite((current) =>
        current
          ? {
              ...current,
              content: {
                ...current.content,
                main: {
                  ...current.content?.main,
                  image: typeof url === 'string' ? url : undefined,
                },
                heroFile: file,
              },
            }
          : null,
      )
    }
  }

  function handleBioChange(value: string): void {
    setWebsite((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              about: { ...current.content?.about, bio: value },
            },
          }
        : null,
    )
  }

  function handleIssuesChange(issues: WebsiteIssue[]): void {
    setWebsite((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              about: { ...current.content?.about, issues },
            },
          }
        : null,
    )
  }

  async function handleAddressSelect(place: GooglePlace): Promise<void> {
    setWebsite((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              contact: {
                ...current.content?.contact,
                address: place.formatted_address,
              },
            },
          }
        : null,
    )

    if (place.formatted_address && place.place_id) {
      setUpdatedPlace(place)
    }
  }

  function handleEmailChange(value: string): void {
    setWebsite((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              contact: { ...current.content?.contact, email: value },
            },
          }
        : null,
    )
    setIsValid(isValidEmail(value))
  }

  function handlePhoneChange(value: string): void {
    setWebsite((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              contact: { ...current.content?.contact, phone: value },
            },
          }
        : null,
    )
    setIsValid(isValidPhone(value))
  }

  function handleCommitteeChange(value: string): void {
    setWebsite((current) =>
      current
        ? {
            ...current,
            content: {
              ...current.content,
              about: { ...current.content?.about, committee: value },
            },
          }
        : null,
    )
  }

  const initialBio = useMemo(
    () => website?.content?.about?.bio || '',
    [website?.id],
  )

  function validateCallback(value: boolean): void {
    setIsValid(value)
  }

  const canPublish =
    website &&
    isValidEmail(website.content?.contact?.email || '') &&
    isValidPhone(website.content?.contact?.phone || '') &&
    website.content?.main?.title != '' &&
    website.vanityPath != ''

  const cantSaveReason = cantSaveReasons(website)

  if (!website) {
    return <div>Loading...</div>
  }

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
                logo={website.content?.logo}
                onChange={handleLogoChange}
              />
            )}

            {step === 3 && (
              <ThemeStep
                theme={website.content?.theme || ''}
                onChange={handleThemeChange}
              />
            )}

            {step === 4 && (
              <HeroStep
                title={website.content?.main?.title}
                tagline={website.content?.main?.tagline}
                image={website.content?.main?.image}
                onTitleChange={handleTitleChange}
                onTaglineChange={handleTaglineChange}
                onImageChange={handleHeroChange}
              />
            )}

            {step === 5 && (
              <AboutStep
                initialBio={initialBio}
                issues={website.content?.about?.issues}
                onBioChange={handleBioChange}
                onIssuesChange={handleIssuesChange}
                initialIssues={initialIssues}
              />
            )}

            {step === 6 && (
              <ContactStep
                address={website.content?.contact?.address}
                email={website.content?.contact?.email}
                phone={website.content?.contact?.phone}
                onAddressSelect={handleAddressSelect}
                onEmailChange={handleEmailChange}
                onPhoneChange={handlePhoneChange}
                committee={website.content?.about?.committee}
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
          {step !== COMPLETE_STEP && typeof step === 'number' && (
            <div className="hidden lg:block h-[60vh]">
              <WebsitePreview website={website} step={step} />
            </div>
          )}
        </div>
        {step !== COMPLETE_STEP && typeof step === 'number' && (
          <WebsiteEditorPageStepper
            totalSteps={NUM_STEPS}
            currentStep={step}
            onStepChange={handleStepChange}
            onComplete={handleComplete}
            completeLabel="Publish website"
            completeLoading={saveLoading}
            nextDisabled={!isValid}
            canPublish={!!canPublish}
            cantSaveReason={cantSaveReason}
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
          step={typeof step === 'number' ? step : undefined}
        />
      </ResponsiveModal>
    </>
  )
}
