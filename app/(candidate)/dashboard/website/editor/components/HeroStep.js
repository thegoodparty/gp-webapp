import TextField from '@shared/inputs/TextField'
import ImageInput from '@shared/inputs/ImageInput'
import Caption from './WebsiteEditorPageCaption'
import Label from './Label'
import H2 from '@shared/typography/H2'

export default function HeroStep({
  title,
  tagline,
  image,
  onTitleChange,
  onTaglineChange,
  onImageChange,
  noHeading = false,
}) {
  return (
    <div>
      {!noHeading && (
        <H2 className="mb-6">Customize the content visitors will see first</H2>
      )}
      <Label>
        Title <sup>*</sup>
      </Label>
      <TextField
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        fullWidth
      />
      <Label className="mt-4">Tagline</Label>
      <TextField
        value={tagline}
        onChange={(e) => onTaglineChange(e.target.value)}
        fullWidth
      />
      <Label className="mt-4">Main Image</Label>
      <ImageInput imageUrl={image} onChange={onImageChange} />
      <Caption>Recommended size: 1280x640px. PNG or JPG format.</Caption>
    </div>
  )
}
