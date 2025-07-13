import { LockOutlined } from '@mui/icons-material'
import { LuCloudUpload } from 'react-icons/lu'
import Button from '@shared/buttons/Button'
import { DisplaySwatch } from './ThemeSwatch'
import { getWebsiteUrl } from '../../util/website.util'
import H5 from '@shared/typography/H5'

export const SECTIONS = {
  link: 'link',
  logo: 'logo',
  theme: 'theme',
  title: 'title',
  about: 'about',
  contact: 'contact',
}

export const SECTION_BTN_CONTENT = {
  [SECTIONS.link]: {
    title: 'Custom link',
    description: 'Custom link',
  },
  [SECTIONS.logo]: {
    title: 'Campaign logo',
    description: 'Upload a logo',
  },
  [SECTIONS.theme]: {
    title: 'Color theme',
  },
  [SECTIONS.title]: {
    title: 'Title details',
    description: 'Update title, tagline and image',
  },
  [SECTIONS.about]: {
    title: 'Campaign details',
    description: 'Update bio and key issues',
  },
  [SECTIONS.contact]: {
    title: 'Contact details',
    description: 'Update campaign address, email and phone number',
  },
}

export default function EditSectionButton({
  section,
  currentSection,
  onSelect,
  website,
}) {
  const url = getWebsiteUrl(website.vanityPath, false, website.domain)
  return (
    <Button
      variant="outlined"
      color="neutral"
      className={`!text-left !border-[1px] !border-black/[0.12] !py-4 ${
        currentSection === section
          ? 'outline outline-2 outline-black !border-transparent'
          : ''
      } ${
        section === SECTIONS.link ? 'flex items-center justify-between' : ''
      }`}
      onClick={() => onSelect(section)}
      disabled={section === SECTIONS.link}
    >
      {section === SECTIONS.link ? (
        <>
          <div className="text-left">
            <H5>{SECTION_BTN_CONTENT[section].title}</H5>
            <p className="text-gray-500 text-xs">{url}</p>
          </div>
          <LockOutlined className="text-gray-500" />
        </>
      ) : section === SECTIONS.logo ? (
        <>
          <H5>{SECTION_BTN_CONTENT[section].title}</H5>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            <LuCloudUpload size={16} />
            {SECTION_BTN_CONTENT[section].description}
          </div>
        </>
      ) : section === SECTIONS.theme ? (
        <>
          <H5 className="mb-1">{SECTION_BTN_CONTENT[section].title}</H5>
          <DisplaySwatch theme={website.content.theme} />
        </>
      ) : (
        <>
          <H5>{SECTION_BTN_CONTENT[section].title}</H5>
          <div className="text-xs text-gray-500 mt-1">
            {SECTION_BTN_CONTENT[section].description}
          </div>
        </>
      )}
    </Button>
  )
}
