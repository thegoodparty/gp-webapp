'use client'
import Image from 'next/image'
import FileDropZone from './FileDropZone'
import Button from '@shared/buttons/Button'

interface ImageInputProps {
  imageUrl?: string | null
  imageLabel?: string
  onChange: (file: File | null) => void
  maxSize?: number
}

const ImageInput = ({
  imageUrl,
  imageLabel = 'Image',
  onChange,
  maxSize = 1 * 1024 * 1024,
}: ImageInputProps): React.JSX.Element => (
  <div>
    {imageUrl ? (
      <div className="text-center bg-white border border-black/[0.12] rounded-lg">
        <Image
          src={imageUrl}
          className="inline py-4"
          alt={imageLabel}
          width={100}
          height={100}
        />
        <div className="border-t border-black/[0.12]">
          <Button
            className="w-full rounded-t-none "
            size="large"
            onClick={() => onChange(null)}
            variant="text"
          >
            Remove {imageLabel}
          </Button>
        </div>
      </div>
    ) : (
      <FileDropZone
        label={`Upload ${imageLabel}`}
        onChange={onChange}
        maxSize={maxSize}
      />
    )}
  </div>
)

export default ImageInput

