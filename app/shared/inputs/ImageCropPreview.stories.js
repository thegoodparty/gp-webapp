import { useState } from 'react'
import ImageCropPreview from './ImageCropPreview'

export default {
  title: 'Inputs/ImageCropPreview',
  component: ImageCropPreview,
  tags: ['autodocs'],
  args: {},
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [file, setFile] = useState(null)

    return (
      <div className="max-w-[400px]">
        <p>Select image to crop</p>
        <input
          className="mb-4"
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (
          <ImageCropPreview
            {...args}
            file={file}
            onCrop={setFile}
            onClear={() => setFile(null)}
          />
        )}
      </div>
    )
  },
}

export const Default = {}
