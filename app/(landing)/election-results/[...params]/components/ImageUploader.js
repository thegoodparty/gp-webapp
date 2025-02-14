'use client';

import ImageUploadWithCrop from '@shared/inputs/ImageUploadWithCrop';
import { revalidateCandidates } from 'helpers/cacheHelper';

export default function ImageUploader({
  campaign,
  candidate,
  isStaged,
  saveCallback,
}) {
  const handleUpload = async (url) => {
    if (isStaged && campaign) {
      await saveCallback({
        ...campaign,
        image: url,
      });
    } else {
      await saveCallback({
        ...candidate,
        image: url,
      });
      revalidateCandidates();
    }
    window.location.reload();
  };

  return (
    <div className="absolute w-full h-full flex items-center justify-center top-0 left-0">
      <ImageUploadWithCrop
        uploadCallback={handleUpload}
        maxFileSize={10000000}
        customElement={
          <div className="bg-lime-400 text-primary text-sm py-1 px-3">
            Edit Image
          </div>
        }
      />

      {/* <ImageUpload
        uploadCallback={handleUpload}
        maxFileSize={10000000}
        customElement={
          <div className="bg-lime-400 text-primary text-sm py-1 px-3">
            Edit Image
          </div>
        }
      /> */}
    </div>
  );
}
