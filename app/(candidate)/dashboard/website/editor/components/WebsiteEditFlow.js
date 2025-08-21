'use client'
import { LuArrowLeft } from 'react-icons/lu'
import Button from '@shared/buttons/Button'
import { useWebsite } from '../../components/WebsiteProvider'
import H4 from '@shared/typography/H4'
import { useEffect, useState } from 'react'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import EditSection from './EditSection'
import WebsitePreview from './WebsitePreview'
import { useMediaQuery } from '@mui/material'
import EditSectionButton, {
  SECTIONS,
  SECTION_BTN_CONTENT,
} from './EditSectionButton'
import { updateWebsite, WEBSITE_STATUS } from '../../util/website.util'
import { useSnackbar } from 'helpers/useSnackbar'
import EditSettingsMenu from './EditSettingsMenu'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { isValidEmail } from 'helpers/validations'
import { isValidPhone } from '@shared/inputs/PhoneInput'

export default function WebsiteEditFlow() {
  const { website, setWebsite } = useWebsite()
  const [editSection, setEditSection] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const isLgUp = useMediaQuery('(min-width:1024px)')
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const [updatedPlace, setUpdatedPlace] = useState(null)

  useEffect(() => {
    if (isLgUp && editSection === null) {
      setEditSection(SECTIONS.logo)
    }
  }, [isLgUp, editSection])

  async function handleSaveAndPublish() {
    setSaveLoading(true)
    const resp = await updateWebsite({
      ...website.content,
      vanityPath: website.vanityPath,
      status: website.status,
    })
    if (updatedPlace) {
      await updateCampaign([
        { key: 'formattedAddress', value: updatedPlace.formatted_address },
        { key: 'placeId', value: updatedPlace.place_id },
      ])
    }
    setSaveLoading(false)
    if (resp.ok) {
      if (website.status === WEBSITE_STATUS.published) {
        trackEvent(EVENTS.CandidateWebsite.Edited)
      }
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

  function handleCommitteeChange(value) {
    setWebsite((current) => ({
      ...current,
      content: {
        ...current.content,
        about: { ...current.content.about, committee: value },
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

  function handleAddressSelect(place) {
    setUpdatedPlace(place)
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

  const canSave =
    isValidEmail(website.content.contact?.email) &&
    isValidPhone(website.content.contact?.phone) &&
    website.content.main?.title != '' &&
    website.vanityPath != ''

  let cantSaveReason = ''
  if (!isValidEmail(website.content.contact?.email)) {
    cantSaveReason = 'Invalid email'
  } else if (!isValidPhone(website.content.contact?.phone)) {
    cantSaveReason = 'Invalid phone'
  } else if (website.content.main?.title == '') {
    cantSaveReason = 'Missing title'
  } else if (website.vanityPath == '') {
    cantSaveReason = 'Missing vanity path'
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4 py-6 lg:grid lg:grid-cols-2 gap-6">
        <div className="lg:border-r lg:border-black/[0.12]">
          <div className="flex items-center justify-between p-2 pt-0 lg:px-8">
            <Button variant="text" href="/dashboard/website">
              <LuArrowLeft size={24} />
            </Button>
            <H4>Edit website</H4>
            <EditSettingsMenu />
          </div>

          <div className="flex flex-col gap-4 p-4 lg:p-6 lg:px-12">
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
        </div>
        {isLgUp && !!editSection && (
          <div className="hidden lg:block">
            <EditSection
              editSection={editSection}
              website={website}
              onLogoChange={handleLogoChange}
              onThemeChange={handleThemeChange}
              onTitleChange={handleTitleChange}
              onTaglineChange={handleTaglineChange}
              onImageChange={handleHeroChange}
              onBioChange={handleBioChange}
              onIssuesChange={handleIssuesChange}
              onCommitteeChange={handleCommitteeChange}
              onAddressSelect={handleAddressSelect}
              onEmailChange={handleEmailChange}
              onPhoneChange={handlePhoneChange}
              onPreviewOpen={() => setPreviewOpen(true)}
              onSave={handleSaveAndPublish}
              canSave={canSave}
              onClose={handleEditSectionClose}
              saveLoading={saveLoading}
              cantSaveReason={cantSaveReason}
            />
          </div>
        )}
      </div>
      <ResponsiveModal
        open={!!editSection && !isLgUp}
        onClose={handleEditSectionClose}
        title={SECTION_BTN_CONTENT[editSection]?.title || 'Edit Content'}
      >
        <EditSection
          editSection={editSection}
          website={website}
          onLogoChange={handleLogoChange}
          onThemeChange={handleThemeChange}
          onTitleChange={handleTitleChange}
          onTaglineChange={handleTaglineChange}
          onImageChange={handleHeroChange}
          onBioChange={handleBioChange}
          onIssuesChange={handleIssuesChange}
          onCommitteeChange={handleCommitteeChange}
          onAddressSelect={handleAddressSelect}
          onEmailChange={handleEmailChange}
          onPhoneChange={handlePhoneChange}
          onPreviewOpen={() => setPreviewOpen(true)}
          onSave={handleSaveAndPublish}
          canSave={canSave}
          onClose={handleEditSectionClose}
          saveLoading={saveLoading}
          cantSaveReason={cantSaveReason}
        />
      </ResponsiveModal>
      <ResponsiveModal
        fullSize
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      >
        <WebsitePreview website={website} className="min-w-[60vw]" />
      </ResponsiveModal>
    </div>
  )
}
