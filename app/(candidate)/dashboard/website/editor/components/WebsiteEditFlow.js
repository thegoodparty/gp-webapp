'use client'
import { LuArrowLeft, LuEye } from 'react-icons/lu'
import Button from '@shared/buttons/Button'
import { useWebsite } from '../../components/WebsiteProvider'
import H4 from '@shared/typography/H4'
import { useEffect, useState } from 'react'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import LogoStep from './LogoStep'
import ThemeStep from './ThemeStep'
import HeroStep from './HeroStep'
import AboutStep from './AboutStep'
import ContactStep from './ContactStep'
import WebsitePreview from './WebsitePreview'
import useMediaQuery from '@mui/material/useMediaQuery'
import EditSectionButton, {
  SECTIONS,
  SECTION_BTN_CONTENT,
} from './EditSectionButton'
import { updateWebsite } from '../../util/website.util'
import { useSnackbar } from 'helpers/useSnackbar'
import EditSettingsMenu from './EditSettingsMenu'

export default function WebsiteEditFlow({ campaign }) {
  const { website, setWebsite } = useWebsite()
  const [editSection, setEditSection] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const isMdUp = useMediaQuery('(min-width:768px)')
  const { errorSnackbar, successSnackbar } = useSnackbar()

  useEffect(() => {
    if (isMdUp && editSection === null) {
      setEditSection(SECTIONS.logo)
    }
  }, [isMdUp, editSection])

  async function handleSaveAndPublish() {
    setSaveLoading(true)
    const resp = await updateWebsite({
      ...website.content,
      vanityPath: website.vanityPath,
      status: website.status,
    })

    setSaveLoading(false)
    if (resp.ok) {
      setWebsite(resp.data)
      successSnackbar('Changes have been published')
    } else {
      console.error('Failed to save website', resp)
      errorSnackbar('Failed to save website')
    }

    return resp.ok
  }

  function handleEditSectionOpen(section) {
    setEditSection(section)
    setPreviewOpen(false)
  }

  function handleEditSectionClose() {
    setEditSection(null)
    setPreviewOpen(false)
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

  function EditSection() {
    return (
      <div className="p-4 flex flex-col gap-4 h-full max-h-[80vh]">
        <div className="grow overflow-auto">
          {editSection === SECTIONS.logo && (
            <LogoStep
              logo={website.content.logo}
              onChange={handleLogoChange}
              noHeading
            />
          )}
          {editSection === SECTIONS.theme && (
            <ThemeStep
              theme={website.content.theme}
              onChange={handleThemeChange}
              noHeading
            />
          )}
          {editSection === SECTIONS.title && (
            <HeroStep
              title={website.content.main?.title}
              tagline={website.content.main?.tagline}
              image={website.content.main?.image}
              onTitleChange={handleTitleChange}
              onTaglineChange={handleTaglineChange}
              onImageChange={handleHeroChange}
              noHeading
            />
          )}
          {editSection === SECTIONS.about && (
            <AboutStep
              bio={website.content.about?.bio}
              issues={website.content.about?.issues}
              onBioChange={handleBioChange}
              onIssuesChange={handleIssuesChange}
              noHeading
            />
          )}
          {editSection === SECTIONS.contact && (
            <ContactStep
              address={website.content.contact?.address}
              email={website.content.contact?.email}
              phone={website.content.contact?.phone}
              onAddressChange={handleAddressChange}
              onEmailChange={handleEmailChange}
              onPhoneChange={handlePhoneChange}
              noHeading
            />
          )}
          <Button
            variant="outlined"
            className="mx-auto flex items-center justify-center gap-2 mt-8"
            onClick={() => setPreviewOpen(true)}
          >
            <LuEye size={16} />
            Preview
          </Button>
        </div>
        <div className="mt-auto flex justify-between">
          <Button
            className="block md:hidden"
            color="neutral"
            size="large"
            onClick={handleEditSectionClose}
          >
            Cancel
          </Button>
          <Button
            className="ml-auto"
            color="primary"
            size="large"
            onClick={handleSaveAndPublish}
            loading={saveLoading}
            disabled={saveLoading}
          >
            Save
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="text" href="/dashboard/website">
          <LuArrowLeft size={24} />
        </Button>
        <H4>Edit website</H4>
        <EditSettingsMenu />
      </div>

      <div className="flex-1 overflow-auto p-4 py-6 md:grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 p-4 md:p-6 md:px-12 md:border-r md:border-black/[0.12]">
          {Object.values(SECTIONS).map((section) => (
            <EditSectionButton
              key={section}
              section={section}
              currentSection={editSection}
              onSelect={handleEditSectionOpen}
              website={website}
            />
          ))}
        </div>
        {isMdUp && !!editSection && (
          <div className="hidden md:block">
            <EditSection />
          </div>
        )}
      </div>
      <ResponsiveModal
        open={!!editSection && !isMdUp}
        onClose={handleEditSectionClose}
        title={SECTION_BTN_CONTENT[editSection]?.title || 'Edit Content'}
      >
        <EditSection />
      </ResponsiveModal>
      <ResponsiveModal
        fullSize
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      >
        <WebsitePreview
          website={website}
          campaign={campaign}
          className="min-w-[60vw]"
        />
      </ResponsiveModal>
    </div>
  )
}
