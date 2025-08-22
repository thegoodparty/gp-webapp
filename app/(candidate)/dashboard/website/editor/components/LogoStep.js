'use client'
import ImageInput from '@shared/inputs/ImageInput'
import Caption from './WebsiteEditorPageCaption'
import H2 from '@shared/typography/H2'

export default function LogoStep({ logo, onChange, noHeading = false }) {
  return (
    <div>
      {!noHeading && (
        <H2 className="mb-6">Upload your campaign logo if you have one</H2>
      )}
      <ImageInput
        imageUrl={logo}
        imageLabel="Logo"
        onChange={onChange}
        maxSize={0.5 * 1024 * 1024}
      />
      <Caption>
        Recommended size: 200x80px. PNG or JPG format. Max size: 500KB.
      </Caption>
    </div>
  )
}
