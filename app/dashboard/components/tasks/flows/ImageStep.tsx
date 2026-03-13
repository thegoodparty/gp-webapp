'use client'

import { useState, useMemo } from 'react'
import 'react-image-crop/dist/ReactCrop.css'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import FileDropZone from '@shared/inputs/FileDropZone'
import ImageCropPreview from '@shared/inputs/ImageCropPreview'
import { trackEvent, buildTrackingAttrs } from 'helpers/analyticsHelper'
import Button from '@shared/buttons/Button'

const MAX_FILE_SIZE = 500000

interface ImageStepProps {
  type: string
  image: File | null
  onChangeCallback: (key: string, value: File | null) => void
  nextCallback: () => void
  backCallback: () => void
}

export default function ImageStep({
  type,
  image,
  onChangeCallback,
  nextCallback,
  backCallback,
}: ImageStepProps) {
  const [file, setFile] = useState<File | null>(image)
  const fileTooLarge = file?.size ? file.size > MAX_FILE_SIZE : false

  const trackingAttrs = useMemo(
    () => buildTrackingAttrs('Next Image', { type }),
    [type],
  )

  function handleOnChange(newFile: File | null) {
    setFile(newFile)
    onChangeCallback('image', newFile)

    if (file && file.size > MAX_FILE_SIZE) {
      trackEvent('schedule_campaign_image_too_large', { fileSize: file.size })
    }
  }

  function handleClearFile(): void {
    setFile(null)
    onChangeCallback('image', null)
  }

  return (
    <div className="p-4">
      <H1 className="mb-4 text-center">Attach image</H1>
      <Body1 className="text-center my-8">
        Attach your image below.
        <br />
        <span className={fileTooLarge ? 'text-error' : ''}>
          Max file size:&nbsp;
          {file ? `${(Number(file.size) / 1000).toLocaleString()} kB / ` : ''}
          {(MAX_FILE_SIZE / 1000).toLocaleString()} kB
        </span>
        <br />
        <span className="font-bold">Accepted File Types: JPG, PNG or GIF.</span>
      </Body1>
      {file ? (
        <ImageCropPreview
          file={file}
          onCrop={handleOnChange}
          onClear={handleClearFile}
        />
      ) : (
        <FileDropZone maxSize={MAX_FILE_SIZE} onChange={handleOnChange} />
      )}
      <div className="mt-8 flex justify-between">
        <Button size="large" color="neutral" onClick={backCallback}>
          Back
        </Button>
        <Button
          size="large"
          color="secondary"
          disabled={!file || fileTooLarge}
          onClick={nextCallback}
          {...trackingAttrs}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
