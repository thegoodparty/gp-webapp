'use client'

import { useState, useEffect, useRef } from 'react'
import ReactCrop from 'react-image-crop'
import type { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Button from '@shared/buttons/Button'
import { DeleteRounded, CropRounded } from '@mui/icons-material'

interface ImageCropPreviewProps {
  file: File
  onCrop: (file: File) => void
  onClear: () => void
}

const ImageCropPreview = ({
  file,
  onCrop,
  onClear,
}: ImageCropPreviewProps): React.JSX.Element => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgUrl, setImgUrl] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [showCrop, setShowCrop] = useState(false)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  })

  useEffect(() => {
    if (file) {
      setLoading(true)
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        setImgUrl(reader.result as string)
        setLoading(false)
      })
      reader.readAsDataURL(file)
    }
  }, [file])

  const handleCropComplete = async () => {
    const image = imgRef.current

    if (crop && image) {
      const canvas = new OffscreenCanvas(300, 300)

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const ctx = canvas.getContext('2d')
      const pixelRatio = window.devicePixelRatio
      canvas.width = crop.width * pixelRatio * scaleX
      canvas.height = crop.height * pixelRatio * scaleY

      if (ctx) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        ctx.imageSmoothingQuality = 'high'

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY,
        )
      }

      const newFile = new File(
        [await canvas.convertToBlob({ type: file.type })],
        file.name,
        { type: file.type },
      )
      setShowCrop(false)
      onCrop(newFile)
    }
  }

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      ) : showCrop ? (
        <>
          <div className="w-full text-center">
            <ReactCrop
              className="w-full"
              crop={crop}
              onChange={(c) => setCrop(c)}
            >
              <img
                ref={imgRef}
                className="w-full"
                alt="Crop Image"
                src={imgUrl}
              />
            </ReactCrop>
          </div>
          <div className="flex justfify-left gap-2">
            <Button onClick={() => setShowCrop(false)} size="small">
              Cancel
            </Button>
            <Button onClick={handleCropComplete} size="small">
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-lg relative group overflow-hidden text-center">
            <img className="w-full" alt="Image Preview" src={imgUrl} />
            <div className="absolute inset-0 hidden group-hover:flex flex-col gap-2 items-center justify-center bg-black/40">
              <Button
                onClick={() => setShowCrop(true)}
                color="white"
                className="flex items-center gap-2 justify-center w-[150px]"
              >
                <CropRounded />
                Crop
              </Button>
              <Button
                onClick={() => onClear()}
                color="white"
                className="flex items-center gap-2 justify-center w-[150px]"
              >
                <DeleteRounded />
                Remove
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ImageCropPreview
