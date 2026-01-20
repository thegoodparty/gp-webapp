import { LuEye } from 'react-icons/lu'
import Button from '@shared/buttons/Button'
import LogoStep from './LogoStep'
import ThemeStep from './ThemeStep'
import HeroStep from './HeroStep'
import AboutStep from './AboutStep'
import ContactStep from './ContactStep'
import { SECTIONS } from './EditSectionButton'
import { useMemo } from 'react'
import { Website, WebsiteIssue } from 'helpers/types'

interface EditSectionProps {
  editSection: string
  website: Website
  onLogoChange: (file: File | null) => void
  onThemeChange: (key: string) => void
  onTitleChange: (value: string) => void
  onTaglineChange: (value: string) => void
  onImageChange: (file: File | null) => void
  onBioChange: (content: string) => void
  onIssuesChange: (issues: WebsiteIssue[]) => void
  onCommitteeChange: (value: string) => void
  onAddressSelect: (place: google.maps.places.PlaceResult) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onPreviewOpen: () => void
  onSave: () => void
  onClose: () => void
  saveLoading: boolean
  canSave: boolean
  cantSaveReason?: string
}

export default function EditSection({
  editSection,
  website,
  onLogoChange,
  onThemeChange,
  onTitleChange,
  onTaglineChange,
  onImageChange,
  onBioChange,
  onIssuesChange,
  onCommitteeChange,
  onAddressSelect,
  onEmailChange,
  onPhoneChange,
  onPreviewOpen,
  onSave,
  onClose,
  saveLoading,
  canSave,
  cantSaveReason,
}: EditSectionProps) {
  const initialBio = useMemo(
    () => website?.content?.about?.bio || '',
    [website?.content?.about?.bio],
  )
  return (
    <div className="p-4 flex flex-col gap-4 h-full max-h-[80vh]">
      <div className="grow overflow-auto">
        {editSection === SECTIONS.logo && (
          <LogoStep
            logo={website.content?.logo}
            onChange={onLogoChange}
            noHeading
          />
        )}
        {editSection === SECTIONS.theme && (
          <ThemeStep
            theme={typeof website.content?.theme === 'string' ? website.content.theme : ''}
            onChange={onThemeChange}
            noHeading
          />
        )}
        {editSection === SECTIONS.title && (
          <HeroStep
            title={website.content?.main?.title}
            tagline={website.content?.main?.tagline}
            image={website.content?.main?.image}
            onTitleChange={onTitleChange}
            onTaglineChange={onTaglineChange}
            onImageChange={onImageChange}
            noHeading
          />
        )}
        {editSection === SECTIONS.about && (
          <AboutStep
            initialBio={initialBio}
            issues={website.content?.about?.issues}
            onBioChange={onBioChange}
            onIssuesChange={onIssuesChange}
            noHeading
          />
        )}
        {editSection === SECTIONS.contact && (
          <ContactStep
            address={website.content?.contact?.address}
            email={website.content?.contact?.email}
            phone={website.content?.contact?.phone}
            onAddressSelect={onAddressSelect}
            onEmailChange={onEmailChange}
            onPhoneChange={onPhoneChange}
            committee={website.content?.about?.committee}
            onCommitteeChange={onCommitteeChange}
            noHeading
          />
        )}
        <Button
          variant="outlined"
          className="mx-auto flex items-center justify-center gap-2 mt-8"
          onClick={onPreviewOpen}
        >
          <LuEye size={16} />
          Preview
        </Button>
      </div>
      {cantSaveReason && (
        <div className="text-red-500 text-sm flex justify-end">
          {cantSaveReason}
        </div>
      )}
      <div className="mt-auto flex justify-between">
        <Button
          className="block lg:hidden"
          color="neutral"
          size="large"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="ml-auto"
          color="primary"
          size="large"
          onClick={onSave}
          loading={saveLoading}
          disabled={saveLoading || !canSave}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
