import { LuEye } from 'react-icons/lu'
import Button from '@shared/buttons/Button'
import LogoStep from './LogoStep'
import ThemeStep from './ThemeStep'
import HeroStep from './HeroStep'
import AboutStep from './AboutStep'
import ContactStep from './ContactStep'
import { SECTIONS } from './EditSectionButton'
import { useMemo } from 'react'

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
  onAddressChange,
  onEmailChange,
  onPhoneChange,
  onPreviewOpen,
  onSave,
  onClose,
  saveLoading,
}) {
  const initialBio = useMemo(
    () => website?.content?.about?.bio || '',
    [website?.id],
  )
  return (
    <div className="p-4 flex flex-col gap-4 h-full max-h-[80vh]">
      <div className="grow overflow-auto">
        {editSection === SECTIONS.logo && (
          <LogoStep
            logo={website.content.logo}
            onChange={onLogoChange}
            noHeading
          />
        )}
        {editSection === SECTIONS.theme && (
          <ThemeStep
            theme={website.content.theme}
            onChange={onThemeChange}
            noHeading
          />
        )}
        {editSection === SECTIONS.title && (
          <HeroStep
            title={website.content.main?.title}
            tagline={website.content.main?.tagline}
            image={website.content.main?.image}
            onTitleChange={onTitleChange}
            onTaglineChange={onTaglineChange}
            onImageChange={onImageChange}
            noHeading
          />
        )}
        {editSection === SECTIONS.about && (
          <AboutStep
            initialBio={initialBio}
            bio={website.content.about?.bio}
            issues={website.content.about?.issues}
            committee={website.content.about?.committee}
            onBioChange={onBioChange}
            onIssuesChange={onIssuesChange}
            onCommitteeChange={onCommitteeChange}
            noHeading
          />
        )}
        {editSection === SECTIONS.contact && (
          <ContactStep
            address={website.content.contact?.address}
            email={website.content.contact?.email}
            phone={website.content.contact?.phone}
            onAddressChange={onAddressChange}
            onEmailChange={onEmailChange}
            onPhoneChange={onPhoneChange}
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
          disabled={saveLoading}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
