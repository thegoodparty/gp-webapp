'use client'
import Image from 'next/image'
import FileDropZone from './FileDropZone'
import Button from '@shared/buttons/Button'

export default function ImageInput({
  imageUrl,
  imageLabel = 'Image',
  onChange,
}) {
  return (
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
              Replace {imageLabel}
            </Button>
          </div>
        </div>
      ) : (
        <FileDropZone label={`Upload ${imageLabel}`} onChange={onChange} />
      )}
    </div>
  )
}
