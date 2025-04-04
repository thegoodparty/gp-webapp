import Image from 'next/image'
import FileDropZone from './FileDropZone'
import { useState } from 'react'

export default {
  title: 'Inputs/FileDropZone',
  component: FileDropZone,
  tags: ['autodocs'],
  args: {},
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [file, setFile] = useState(null)

    const fileUrl = file && URL.createObjectURL(file)

    return (
      <div className="flex flex-col gap-3 items-start">
        <FileDropZone {...args} onChange={setFile} />

        {file && (
          <>
            <p>Selected image shown here for storybook</p>
            <Image src={fileUrl} width={200} height={200} alt="img" />
          </>
        )}
      </div>
    )
  },
}

export const Default = {}
