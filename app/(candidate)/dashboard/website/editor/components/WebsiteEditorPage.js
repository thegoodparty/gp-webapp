'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import WebsitePreview from './WebsitePreview'
import { useWebsite } from '../../components/WebsiteProvider'
import { updateWebsite, WEBSITE_STATUS } from '../../util/website.util'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import Button from '@shared/buttons/Button'
import { useSnackbar } from 'helpers/useSnackbar'
import Stepper from './Stepper'
import VanityPathStep from './VanityPathStep'
import LogoStep from './LogoStep'
import ThemeStep from './ThemeStep'
import HeroStep from './HeroStep'
import AboutStep from './AboutStep'
import ContactStep from './ContactStep'
import CompleteStep from './CompleteStep'

const COMPLETE_STEP = 'complete'
const NUM_STEPS = 6

export default function WebsiteEditorPage({ pathname }) {
  const router = useRouter()
  const [campaign] = useCampaign()
  const { website, setWebsite } = useWebsite()
  const { errorSnackbar } = useSnackbar()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [saveLoading, setSaveLoading] = useState(false)

  async function handleSaveAndExit() {
    const saved = await handleSave()

    if (saved) {
      console.log('saved', saved)
      router.push('/dashboard/website')
    }
  }

  async function handleComplete() {
    setWebsite((current) => ({ ...current, status: WEBSITE_STATUS.published }))
    const saved = await handleSave(true)

    if (saved) {
      setStep(COMPLETE_STEP)
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
    })
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
      setLogo(undefined, undefined)
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
      setHero(undefined, undefined)
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

  function handleAddressChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        contact: { ...current.content.contact, address: value },
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
  }

  function handlePhoneChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        contact: { ...current.content.contact, phone: value },
      },
    }))
  }

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          {step === COMPLETE_STEP ? (
            <Button variant="outlined" href="/dashboard/website">
              Exit
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleSaveAndExit}
              disabled={saveLoading}
              loading={saveLoading}
            >
              Save & Exit
            </Button>
          )}
          <Button variant="outlined" onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4 py-6">
          {step === 1 && (
            <VanityPathStep
              vanityPath={website.vanityPath}
              onChange={handleVanityPathChange}
            />
          )}

          {step === 2 && (
            <LogoStep logo={website.content.logo} onChange={handleLogoChange} />
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
              bio={website.content.about?.bio}
              issues={website.content.about?.issues}
              onBioChange={handleBioChange}
              onIssuesChange={handleIssuesChange}
            />
          )}

          {step === 6 && (
            <ContactStep
              address={website.content.contact?.address}
              email={website.content.contact?.email}
              phone={website.content.contact?.phone}
              onAddressChange={handleAddressChange}
              onEmailChange={handleEmailChange}
              onPhoneChange={handlePhoneChange}
            />
          )}
          {step === COMPLETE_STEP && (
            <CompleteStep vanityPath={website.vanityPath} />
          )}
        </div>
        {step === COMPLETE_STEP ? (
          <Button className="self-end" size="large" href="/dashboard/website">
            Finish
          </Button>
        ) : (
          <Stepper
            totalSteps={NUM_STEPS}
            currentStep={step}
            onStepChange={handleStepChange}
            onComplete={handleComplete}
            completeLabel="Publish website"
            completeLoading={saveLoading}
          />
        )}
      </div>
      <ResponsiveModal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <WebsitePreview website={website} campaign={campaign} />
      </ResponsiveModal>
    </DashboardLayout>
  )
}
