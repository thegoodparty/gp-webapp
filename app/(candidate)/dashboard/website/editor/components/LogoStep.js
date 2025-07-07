'use client'
import ImageInput from '@shared/inputs/ImageInput'
import Caption from './Caption'
import H2 from '@shared/typography/H2'

export default function LogoStep({ logo, onChange, noHeading = false }) {
  return (
    <div>
      {!noHeading && (
        <H2 className="mb-6">Upload your campaign logo if you have one</H2>
      )}
      <ImageInput imageUrl={logo} imageLabel="Logo" onChange={onChange} />
      <Caption>Recommended size: 200x80px. PNG or JPG format.</Caption>
    </div>
  )
}
