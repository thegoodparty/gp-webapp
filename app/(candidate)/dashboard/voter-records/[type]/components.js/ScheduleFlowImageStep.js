'use client';

import { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import FileDropZone from '@shared/inputs/FIleDropZone';
import ImageCropPreview from '@shared/inputs/ImageCropPreview';

const MAX_FILE_SIZE = 500000;

export default function ScheduleFlowImageStep({
  onChangeCallback,
  nextCallback,
  backCallback,
}) {
  const [file, setFile] = useState();

  function handleOnChange(newFile) {
    setFile(newFile);
    onChangeCallback('image', newFile);
  }

  function handleClearFile() {
    setFile(null);
    onChangeCallback('image', null);
  }

  return (
    <div className="p-4 min-w-[500px]">
      <H1 className="mb-4 text-center">Attach Image</H1>
      <Body1 className="text-center my-8">
        Attach your image below.
        <br />
        <span className="font-bold">Accepted File Types: JPG, PNG or GIF.</span>
        {file && (
          <>
            <br />
            <span className={file.size > MAX_FILE_SIZE ? 'text-error' : ''}>
              File size: {Number(file.size).toLocaleString()} kB /{' '}
              {MAX_FILE_SIZE.toLocaleString()} kB
            </span>
          </>
        )}
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
        <SecondaryButton onClick={backCallback}>Back</SecondaryButton>
        <PrimaryButton disabled={!file} onClick={nextCallback}>
          Next
        </PrimaryButton>
      </div>
    </div>
  );
}
