'use client'
import React, { useEffect, useState } from 'react'
import { LuArrowLeft } from 'react-icons/lu'
import Button from '@shared/buttons/Button'
import { useWebsite } from '../../components/WebsiteProvider'
import H4 from '@shared/typography/H4'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import EditSection from './EditSection'
import WebsitePreview from './WebsitePreview'
import { useMediaQuery } from '@mui/material'
import EditSectionButton, {
  SECTIONS,
  SECTION_KEYS,
  SECTION_BTN_CONTENT,
  SectionKey,
} from './EditSectionButton'
import { updateWebsite, WEBSITE_STATUS } from '../../util/website.util'
import { useSnackbar } from 'helpers/useSnackbar'
import EditSettingsMenu from './EditSettingsMenu'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { isValidEmail } from 'helpers/validations'
import { isValidPhone } from '@shared/inputs/PhoneInput'
import { cantSaveReasons } from '../../create/components/WebsiteCreateFlow'
import { WebsiteIssue } from 'helpers/types'

interface GooglePlace {
  formatted_address?: string
  place_id?: string
}

type SectionType = SectionKey | null

export default function WebsiteEditFlow(): React.JSX.Element {
  const { website, setWebsite } = useWebsite()
  const [editSection, setEditSection] = useState<SectionType>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const isLgUp = useMediaQuery('(min-width:1024px)')
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const [updatedPlace, setUpdatedPlace] = useState<GooglePlace | null>(null)

  useEffect(() => {
    if (isLgUp && editSection === null) {
      setEditSection(SECTIONS.logo)
    }
  }, [isLgUp, editSection])

  async function handleSaveAndPublish(): Promise<boolean> {
    if (!website) return false
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
    if (resp && resp.ok) {
      if (website.status === WEBSITE_STATUS.published) {
        trackEvent(EVENTS.CandidateWebsite.Edited)
      }
      setWebsite(resp.data)
      successSnackbar('Changes have been published')
      return true
    } else {
      console.error('Failed to save website', resp)
      errorSnackbar('Failed to save website')
      return false
    }
  }

  function handleEditSectionOpen(section: SectionType): void {
    setEditSection(section)
    setPreviewOpen(false)
  }

  function handleEditSectionClose(): void {
    setEditSection(null)
    setPreviewOpen(false)
  }

  function handleLogoChange(file: File | null): void {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogo(reader.result, file)
      reader.readAsDataURL(file)
    } else {
      setLogo(null, undefined)
    }
    function setLogo(url: string | ArrayBuffer | null, file: File | undefined): void {
      setWebsite((current) => current ? {
        ...current,
        content: {
          ...current.content,
          logo: typeof url === 'string' ? url : undefined,
          logoFile: file,
        },
      } : null)
    }
  }

  function handleThemeChange(color: string): void {
    setWebsite((current) => current ? {
      ...current,
      content: {
        ...current.content,
        theme: color,
      },
    } : null)
  }

  function handleTitleChange(value: string): void {
    setWebsite((current) => current ? {
      ...current,
      content: {
        ...current.content,
        main: { ...current.content?.main, title: value },
      },
    } : null)
  }

  function handleTaglineChange(value: string): void {
    setWebsite((current) => current ? {
      ...current,
      content: {
        ...current.content,
        main: { ...current.content?.main, tagline: value },
      },
    } : null)
  }

  function handleHeroChange(file: File | null): void {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setHero(reader.result, file)
      reader.readAsDataURL(file)
    } else {
      setHero(null, undefined)
    }

    function setHero(url: string | ArrayBuffer | null, file: File | undefined): void {
      setWebsite((current) => current ? {
        ...current,
        content: {
          ...current.content,
          main: { ...current.content?.main, image: typeof url === 'string' ? url : undefined },
          heroFile: file,
        },
      } : null)
    }
  }

  function handleBioChange(value: string): void {
    setWebsite((current) => current ? {
      ...current,
      content: {
        ...current.content,
        about: { ...current.content?.about, bio: value },
      },
    } : null)
  }

  function handleCommitteeChange(value: string): void {
    setWebsite((current) => current ? {
      ...current,
      content: {
        ...current.content,
        about: { ...current.content?.about, committee: value },
      },
    } : null)
  }

  function handleIssuesChange(issues: WebsiteIssue[]): void {
    setWebsite((current) => current ? {
      ...current,
      content: {
        ...current.content,
        about: { ...current.content?.about, issues },
      },
    } : null)
  }

  function handleAddressSelect(place: GooglePlace): void {
    setUpdatedPlace(place)
    setWebsite((current) => current ? {
      ...current,
      content: {
        ...current.content,
        contact: {
          ...current.content?.contact,
          address: place.formatted_address,
        },
      },
    } : null)
  }

  function handleEmailChange(value: string): void {
    setWebsite((current) => current ? {
      ...current,
      content: {
        ...current.content,
        contact: { ...current.content?.contact, email: value },
      },
    } : null)
  }

  function handlePhoneChange(value: string): void {
    setWebsite((current) => current ? {
      ...current,
      content: {
        ...current.content,
        contact: { ...current.content?.contact, phone: value },
      },
    } : null)
  }

  if (!website) {
    return <div>Loading...</div>
  }

  const canSave =
    isValidEmail(website.content?.contact?.email || '') &&
    isValidPhone(website.content?.contact?.phone || '') &&
    website.content?.main?.title != '' &&
    website.vanityPath != ''

  const cantSaveReason = cantSaveReasons(website)

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
            {SECTION_KEYS.map((key) => (
              <EditSectionButton
                key={key}
                section={key}
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
        title={editSection ? SECTION_BTN_CONTENT[editSection]?.title || 'Edit Content' : 'Edit Content'}
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
